import { GoogleAuthProvider, signInWithPopup, User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/meetings.space.created');
provider.addScope('https://www.googleapis.com/auth/meetings.space.readonly');
provider.addScope('https://www.googleapis.com/auth/meetings.space.settings');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface MeetSpaceResponse {
  name: string; // e.g., "spaces/abc-defg-hij"
  meetingUri: string; // e.g., "https://meet.google.com/abc-defg-hij"
  meetingCode?: string;
  config?: {
    accessType?: string;
    entryPointAccess?: string;
  };
}

export const initMeetAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const googleMeetSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not retrieve access token from Google sign-in.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getMeetAccessToken = (): string | null => cachedAccessToken;

export const createMeetSpace = async (token?: string): Promise<MeetSpaceResponse> => {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('Google authentication required to create a Google Meet space.');
  }

  const res = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        accessType: 'OPEN',
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to create Google Meet space:', errorText);
    throw new Error(`Google Meet API error (${res.status}): ${errorText}`);
  }

  const data: MeetSpaceResponse = await res.json();
  return data;
};
