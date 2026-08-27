import mqtt, { MqttClient } from 'mqtt';
import { RealtimeEvent, RealtimeEventType } from '../types';
import { getApiBaseUrl } from './api';

type Listener = (event: RealtimeEvent) => void;
type StatusListener = (connected: boolean, transport: string, latencyMs?: number) => void;

const MQTT_BROKER_URLS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://test.mosquitto.org:8081'
];
const MQTT_TOPIC = 'telpro/mybirawa_tif/realtime_sync_v2';
const CLIENT_INSTANCE_ID = `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

class RealtimeSyncManager {
  private mqttClient: MqttClient | null = null;
  private eventSource: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  
  private listeners: Set<Listener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();
  
  private isConnected = false;
  private currentTransport: 'cloud_mqtt' | 'sse' | 'broadcast' | 'offline' = 'offline';
  private currentBrokerIndex = 0;
  private reconnectTimer: any = null;
  private heartbeatTimer: any = null;
  private pingStartTime = 0;
  private latencyMs = 0;
  private recentProcessedEvents = new Set<string>();

  constructor() {
    this.initBroadcastChannel();
    this.initMqtt();
    this.initSSE();
    this.startHeartbeat();
  }

  // 1. Cross-Tab Channel (Instant same-device communication)
  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('tif_hk_realtime_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type) {
            this.handleIncomingEvent(event.data as RealtimeEvent, 'broadcast');
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not available:', e);
      }
    }
  }

  // 2. Cloud MQTT over WebSocket (Multi-device global real-time synchronization)
  private initMqtt() {
    if (typeof window === 'undefined') return;

    try {
      const brokerUrl = MQTT_BROKER_URLS[this.currentBrokerIndex % MQTT_BROKER_URLS.length];
      
      this.mqttClient = mqtt.connect(brokerUrl, {
        clientId: CLIENT_INSTANCE_ID,
        clean: true,
        connectTimeout: 7000,
        reconnectPeriod: 4000,
        keepalive: 30
      });

      this.mqttClient.on('connect', () => {
        this.isConnected = true;
        this.currentTransport = 'cloud_mqtt';
        this.notifyStatus();

        this.mqttClient?.subscribe(MQTT_TOPIC, { qos: 1 }, (err) => {
          if (err) {
            console.warn('Failed to subscribe to MQTT topic:', err);
          }
        });
      });

      this.mqttClient.on('message', (_topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          if (payload && payload.event) {
            // If sender is not self, handle incoming event
            if (payload.senderId !== CLIENT_INSTANCE_ID) {
              this.handleIncomingEvent(payload.event as RealtimeEvent, 'cloud_mqtt');
            }
          }
          if (payload && payload.type === 'PING_ACK' && payload.senderId === CLIENT_INSTANCE_ID) {
            if (this.pingStartTime > 0) {
              this.latencyMs = Math.max(10, Date.now() - this.pingStartTime);
              this.notifyStatus();
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      });

      this.mqttClient.on('error', (err) => {
        console.warn('MQTT Connection Warning:', err?.message || err);
        this.trySwitchBroker();
      });

      this.mqttClient.on('offline', () => {
        if (this.currentTransport === 'cloud_mqtt') {
          this.isConnected = false;
          this.currentTransport = 'offline';
          this.notifyStatus();
        }
      });
    } catch (err) {
      console.warn('Error setting up MQTT client:', err);
    }
  }

  private trySwitchBroker() {
    this.currentBrokerIndex++;
    if (this.mqttClient) {
      try {
        this.mqttClient.end(true);
      } catch (e) {}
      this.mqttClient = null;
    }
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.initMqtt();
      }, 3000);
    }
  }

  // 3. SSE Fallback (If Backend Server is active)
  private initSSE() {
    if (typeof window === 'undefined') return;

    const baseUrl = getApiBaseUrl();
    // Don't connect SSE if on static without explicit backend
    if (!baseUrl && window.location.hostname.includes('github.io')) {
      return;
    }

    try {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }

      this.eventSource = new EventSource(`${baseUrl}/api/realtime/stream`);

      this.eventSource.onopen = () => {
        if (this.currentTransport !== 'cloud_mqtt') {
          this.isConnected = true;
          this.currentTransport = 'sse';
          this.notifyStatus();
        }
      };

      this.eventSource.onmessage = (messageEvent) => {
        try {
          const data = JSON.parse(messageEvent.data);
          if (data.type === 'CONNECTED') {
            return;
          }
          this.handleIncomingEvent(data as RealtimeEvent, 'sse');
        } catch (e) {}
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
      };
    } catch (e) {}
  }

  // Heartbeat & Ping
  private startHeartbeat() {
    if (typeof window === 'undefined') return;

    this.heartbeatTimer = setInterval(() => {
      if (this.mqttClient && this.mqttClient.connected) {
        this.pingStartTime = Date.now();
        this.mqttClient.publish(
          MQTT_TOPIC,
          JSON.stringify({
            type: 'PING_ACK',
            senderId: CLIENT_INSTANCE_ID,
            timestamp: new Date().toISOString()
          })
        );
      }
    }, 20000);
  }

  private handleIncomingEvent(event: RealtimeEvent, _source: string) {
    if (!event || !event.id) return;
    
    // Prevent duplicate processing
    if (this.recentProcessedEvents.has(event.id)) {
      return;
    }
    this.recentProcessedEvents.add(event.id);

    // Limit memory
    if (this.recentProcessedEvents.size > 200) {
      const arr = Array.from(this.recentProcessedEvents);
      this.recentProcessedEvents = new Set(arr.slice(-100));
    }

    this.notifyListeners(event);
  }

  public emitLocalEvent(type: RealtimeEventType, data: any) {
    const event: RealtimeEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      timestamp: new Date().toISOString()
    };

    // Mark as self-processed
    this.recentProcessedEvents.add(event.id);

    // 1. Publish to Cloud MQTT Broker for other devices (cross-device multi-client)
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        this.mqttClient.publish(
          MQTT_TOPIC,
          JSON.stringify({
            senderId: CLIENT_INSTANCE_ID,
            event
          }),
          { qos: 1 }
        );
      } catch (e) {
        console.warn('MQTT publish error:', e);
      }
    }

    // 2. Broadcast to other tabs on same device
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch (e) {}
    }

    // 3. Trigger listeners in current window
    this.notifyListeners(event);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onStatusChange(callback: StatusListener): () => void {
    this.statusListeners.add(callback);
    callback(this.isConnected, this.currentTransport, this.latencyMs);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      transport: this.currentTransport,
      latencyMs: this.latencyMs,
      instanceId: CLIENT_INSTANCE_ID
    };
  }

  private notifyListeners(event: RealtimeEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in realtime listener:', err);
      }
    });
  }

  private notifyStatus() {
    this.statusListeners.forEach((fn) => {
      try {
        fn(this.isConnected, this.currentTransport, this.latencyMs);
      } catch (err) {
        console.error('Error in realtime status listener:', err);
      }
    });
  }
}

export const realtimeManager = new RealtimeSyncManager();
