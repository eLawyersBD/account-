import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { SavedGrowthScenario } from '../types';

/**
 * Real-time subscription to Growth ROI Calculator scenarios for an authenticated client.
 */
export function subscribeToUserScenarios(
  userId: string,
  onUpdate: (scenarios: SavedGrowthScenario[]) => void,
  onError?: (err: any) => void
): () => void {
  const collectionRef = collection(db, 'growth_scenarios');
  const q = query(
    collectionRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(3)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const scenarios: SavedGrowthScenario[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        scenarios.push({
          id: docSnap.id,
          userId: data.userId,
          name: data.name || 'Untitled Scenario',
          savedAt: data.savedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currentRevenue: data.currentRevenue || 750000,
          targetGrowthPercent: data.targetGrowthPercent || 35,
          grossMarginPercent: data.grossMarginPercent || 50,
          timeframeView: data.timeframeView || '12_months',
          timeHorizonYears: data.timeHorizonYears || 3,
          levers: data.levers || {
            salesVelocity: true,
            pricing: true,
            taxOpex: true,
            workingCapital: true
          },
          metrics: data.metrics || {
            revenueLift: 0,
            month12ExitOrProfit: 0,
            roiMultiple: 0,
            effectiveGrowth: 0,
            timeframeLabel: '12-Month Ramp'
          },
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      onUpdate(scenarios);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'growth_scenarios');
      // If composite index is pending, fallback to simpler query
      try {
        const fallbackQ = query(collectionRef, where('userId', '==', userId), limit(3));
        const fallbackUnsub = onSnapshot(fallbackQ, (snapshot) => {
          const scenarios: SavedGrowthScenario[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            scenarios.push({
              id: docSnap.id,
              userId: data.userId,
              name: data.name || 'Untitled Scenario',
              savedAt: data.savedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              currentRevenue: data.currentRevenue || 750000,
              targetGrowthPercent: data.targetGrowthPercent || 35,
              grossMarginPercent: data.grossMarginPercent || 50,
              timeframeView: data.timeframeView || '12_months',
              timeHorizonYears: data.timeHorizonYears || 3,
              levers: data.levers || {
                salesVelocity: true,
                pricing: true,
                taxOpex: true,
                workingCapital: true
              },
              metrics: data.metrics || {
                revenueLift: 0,
                month12ExitOrProfit: 0,
                roiMultiple: 0,
                effectiveGrowth: 0,
                timeframeLabel: '12-Month Ramp'
              }
            });
          });
          onUpdate(scenarios);
        });
        return fallbackUnsub;
      } catch (fallbackErr) {
        if (onError) onError(fallbackErr);
      }
    }
  );
}

/**
 * Persists a scenario to Firestore for an authenticated user.
 */
export async function saveScenarioToFirestore(
  userId: string,
  scenario: SavedGrowthScenario
): Promise<void> {
  const scenarioId = scenario.id.startsWith('sc_')
    ? scenario.id
    : `sc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const path = `growth_scenarios/${scenarioId}`;

  try {
    const dataToSave = {
      id: scenarioId,
      userId,
      name: scenario.name.trim().substring(0, 100),
      savedAt: scenario.savedAt,
      currentRevenue: scenario.currentRevenue,
      targetGrowthPercent: scenario.targetGrowthPercent,
      grossMarginPercent: scenario.grossMarginPercent,
      timeframeView: scenario.timeframeView,
      timeHorizonYears: scenario.timeHorizonYears,
      levers: scenario.levers,
      metrics: scenario.metrics,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'growth_scenarios', scenarioId), dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Deletes a scenario from Firestore.
 */
export async function deleteScenarioFromFirestore(scenarioId: string): Promise<void> {
  const path = `growth_scenarios/${scenarioId}`;
  try {
    await deleteDoc(doc(db, 'growth_scenarios', scenarioId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Syncs any un-synced localStorage scenarios to Firestore when the user signs in.
 */
export async function syncLocalScenariosToFirestore(
  userId: string,
  localScenarios: SavedGrowthScenario[]
): Promise<void> {
  if (!localScenarios || localScenarios.length === 0) return;

  try {
    const existingSnap = await getDocs(
      query(collection(db, 'growth_scenarios'), where('userId', '==', userId), limit(3))
    );
    const existingIds = new Set(existingSnap.docs.map((d) => d.id));

    let count = 0;
    for (const scenario of localScenarios) {
      if (count + existingIds.size >= 3) break;
      if (!existingIds.has(scenario.id)) {
        await saveScenarioToFirestore(userId, { ...scenario, userId });
        count++;
      }
    }
  } catch (error) {
    console.warn('Notice: Background sync of local scenarios to Firestore encountered error:', error);
  }
}
