import { RealtimeEvent, RealtimeEventType } from '../types';

type Listener = (event: RealtimeEvent) => void;

class RealtimeSyncManager {
  private eventSource: EventSource | null = null;
  private listeners: Set<Listener> = new Set();
  private statusListeners: Set<(connected: boolean) => void> = new Set();
  private isConnected = false;
  private reconnectTimer: any = null;
  private reconnectAttempts = 0;
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    this.initBroadcastChannel();
    this.connect();
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('tif_hk_realtime_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type) {
            this.notifyListeners(event.data as RealtimeEvent);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }
  }

  public connect() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (e) {}
    }

    try {
      this.eventSource = new EventSource('/api/realtime/stream');

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyStatus(true);
      };

      this.eventSource.onmessage = (messageEvent) => {
        try {
          const data = JSON.parse(messageEvent.data);
          if (data.type === 'CONNECTED') {
            this.isConnected = true;
            this.notifyStatus(true);
            return;
          }
          this.notifyListeners(data as RealtimeEvent);
        } catch (err) {
          // ignore non-JSON messages (like ping)
        }
      };

      this.eventSource.onerror = () => {
        // In local/offline or static environments, status remains fallback connected
        this.isConnected = false;
        this.notifyStatus(false);
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Exponential backoff reconnect
        if (!this.reconnectTimer) {
          const timeout = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
          this.reconnectAttempts++;
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
          }, timeout);
        }
      };
    } catch (err) {
      this.isConnected = false;
      this.notifyStatus(false);
    }
  }

  public emitLocalEvent(type: RealtimeEventType, data: any) {
    const event: RealtimeEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      data,
      timestamp: new Date().toISOString()
    };

    // Broadcast across other tabs in the browser
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch (e) {}
    }

    // Also trigger listeners in the current tab
    this.notifyListeners(event);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onStatusChange(callback: (connected: boolean) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.isConnected);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  public getConnectedStatus(): boolean {
    return this.isConnected;
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

  private notifyStatus(connected: boolean) {
    this.statusListeners.forEach((fn) => {
      try {
        fn(connected);
      } catch (err) {
        console.error('Error in realtime status listener:', err);
      }
    });
  }
}

export const realtimeManager = new RealtimeSyncManager();
