import { db, collection, onSnapshot, setDoc, doc, deleteDoc } from '../firebase';
import { HKSubmission } from '../types';
import { INITIAL_SUBMISSIONS } from '../data/defaultData';
import type { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

const SUBMISSIONS_COLLECTION = 'hk_submissions';

/**
 * Subscribe to real-time HK Submissions from Firestore
 */
export function subscribeToSubmissions(
  onUpdate: (subs: HKSubmission[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!snapshot.empty) {
          const remoteSubs: HKSubmission[] = [];
          snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
            const data = docSnap.data() as HKSubmission;
            remoteSubs.push({
              ...data,
              id: docSnap.id || data.id,
            });
          });
          // Sort by timestamp descending
          remoteSubs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
          onUpdate(remoteSubs);
        } else {
          // If Firestore is empty initially, seed with INITIAL_SUBMISSIONS
          seedInitialSubmissionsIfEmpty();
        }
      },
      (err: Error) => {
        console.warn('Firestore real-time submissions sync error, using local fallback:', err);
        if (onError) onError(err);
      }
    );
  } catch (e: any) {
    console.warn('Failed to subscribe to Firestore submissions:', e);
    if (onError) onError(e);
    return () => {};
  }
}

/**
 * Save / Update an HK submission in Firestore for all users to see
 */
export async function saveSubmissionToCloud(sub: HKSubmission): Promise<void> {
  try {
    const cleanDocId = `${sub.buildingId}_${sub.itemId}_${sub.dateOnly || 'general'}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, SUBMISSIONS_COLLECTION, cleanDocId);
    await setDoc(
      docRef,
      {
        ...sub,
        id: cleanDocId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving submission to Firestore:', err);
    throw err;
  }
}

/**
 * Delete an HK submission from Firestore
 */
export async function deleteSubmissionFromCloud(buildingId: string, itemId: string, dateOnly: string): Promise<void> {
  try {
    const cleanDocId = `${buildingId}_${itemId}_${dateOnly || 'general'}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, SUBMISSIONS_COLLECTION, cleanDocId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting submission from Firestore:', err);
    throw err;
  }
}

/**
 * Initial seed if cloud collection is fresh
 */
async function seedInitialSubmissionsIfEmpty() {
  try {
    for (const sub of INITIAL_SUBMISSIONS) {
      const cleanDocId = `${sub.buildingId}_${sub.itemId}_${sub.dateOnly || '2026-08-20'}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      const docRef = doc(db, SUBMISSIONS_COLLECTION, cleanDocId);
      await setDoc(docRef, { ...sub, id: cleanDocId }, { merge: true });
    }
  } catch (e) {
    console.warn('Initial seeding note:', e);
  }
}
