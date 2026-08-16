import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  setLogLevel 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ArticleItem } from '../types';

// Silence Firestore SDK debug/connectivity warnings in iframe sandbox
try {
  setLogLevel('silent');
} catch {
  // Ignore if setLogLevel fails
}

// Global safety listener for browser IndexedDB/Firestore closing/hidden events
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (
      reason.includes('Database is closing') ||
      reason.includes('database is closing') ||
      reason.includes('Database is hidden') ||
      reason.includes('closing/hidden')
    ) {
      event.preventDefault(); // Suppress transient tab visibility closing errors
    }
  });
}

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = (() => {
  const config = firebaseConfig as Record<string, any>;
  const databaseId = (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') ? config.firestoreDatabaseId : undefined;
  try {
    return initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: true,
    }, databaseId);
  } catch {
    return getFirestore(app);
  }
})();

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

export interface ConsultationBookingInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
}

export async function submitConsultationBooking(input: ConsultationBookingInput): Promise<string> {
  const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `consultation_requests/${requestId}`;
  
  try {
    const requestData: Record<string, unknown> = {
      name: input.name.trim().substring(0, 100),
      email: input.email.trim().substring(0, 100),
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    if (input.phone) requestData.phone = input.phone.trim().substring(0, 30);
    if (input.company) requestData.company = input.company.trim().substring(0, 100);
    if (input.service) requestData.service = input.service.trim().substring(0, 100);
    if (input.message) requestData.message = input.message.trim().substring(0, 1000);

    await setDoc(doc(db, 'consultation_requests', requestId), requestData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  return requestId;
}

export async function getArticlesFromFirestore(): Promise<ArticleItem[]> {
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const articles: ArticleItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      articles.push({
        id: docSnap.id,
        title: data.title || 'Untitled Article',
        category: (data.category as 'Article' | 'Template' | 'Guide') || 'Article',
        readTime: data.readTime || '5 min read',
        date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        excerpt: data.excerpt || '',
        content: data.content || '',
        author: data.author || 'Accounticca Advisory Team',
      });
    });
    return articles;
  } catch (error) {
    console.warn('Could not fetch articles from Firestore, using static dataset fallback:', error);
    return [];
  }
}

export interface NewArticleInput {
  title: string;
  category: 'Article' | 'Template' | 'Guide';
  readTime: string;
  excerpt: string;
  content: string;
  author: string;
}

export async function createArticleInFirestore(input: NewArticleInput): Promise<ArticleItem> {
  const articleId = 'art_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `articles/${articleId}`;
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const articleItem: ArticleItem = {
    id: articleId,
    title: input.title.trim().substring(0, 200),
    category: input.category,
    readTime: input.readTime.trim() || '5 min read',
    date: todayStr,
    excerpt: input.excerpt.trim().substring(0, 500),
    content: input.content.trim(),
    author: input.author.trim().substring(0, 100) || 'Accounticca Advisory Team',
  };

  try {
    const articleData = {
      ...articleItem,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'articles', articleId), articleData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  return articleItem;
}
