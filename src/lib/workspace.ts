import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

// Add Workspace scopes to Google Auth Provider
const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.responses.readonly',
];

WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initWorkspaceAuth = (
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

export const signInWithGoogleWorkspace = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not retrieve access token from Google Workspace sign-in.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getWorkspaceAccessToken = (): string | null => cachedAccessToken;

// ==========================================
// 1. GOOGLE DRIVE API INTEGRATION
// ==========================================
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
  iconLink?: string;
}

export async function fetchDriveFiles(token?: string): Promise<DriveFileItem[]> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink,createdTime,size,iconLink)&pageSize=25&orderBy=createdTime%20desc',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.files || [];
}

export async function uploadDriveFile(
  fileName: string,
  content: string,
  mimeType = 'text/plain',
  token?: string
): Promise<DriveFileItem> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const metadata = {
    name: fileName,
    mimeType,
  };

  const boundary = 'foo_bar_baz_boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Drive Upload API error (${response.status}): ${errText}`);
  }

  return response.json();
}

export async function deleteDriveFile(fileId: string, token?: string): Promise<void> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok && response.status !== 204) {
    const errText = await response.text();
    throw new Error(`Drive Delete API error (${response.status}): ${errText}`);
  }
}

// ==========================================
// 2. GOOGLE SHEETS API INTEGRATION
// ==========================================
export interface SpreadsheetData {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export async function createGoogleSheet(
  title: string,
  rows: (string | number)[][],
  token?: string
): Promise<SpreadsheetData> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  // Create empty spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [{ properties: { title: 'Financial Health & Strategy' } }],
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Sheets API error (${createRes.status}): ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Append initial rows if provided
  if (rows && rows.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: rows,
        }),
      }
    );
  }

  return { spreadsheetId, spreadsheetUrl, title };
}

export async function readGoogleSheetValues(
  spreadsheetId: string,
  range = 'A1:Z100',
  token?: string
): Promise<(string | number)[][]> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Read Sheets API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.values || [];
}

// ==========================================
// 3. GMAIL API INTEGRATION
// ==========================================
export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

export async function sendGmailMessage(
  toEmail: string,
  subject: string,
  bodyText: string,
  token?: string
): Promise<{ id: string }> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  // Construct RFC 2822 email format
  const rawEmail = [
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText,
  ].join('\r\n');

  // Base64URL encode
  const base64EncodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64EncodedEmail,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail Send API error (${response.status}): ${errText}`);
  }

  return response.json();
}

export async function fetchRecentGmailMessages(token?: string): Promise<GmailMessageItem[]> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!listRes.ok) {
    const errText = await listRes.text();
    throw new Error(`Gmail List API error (${listRes.status}): ${errText}`);
  }

  const listData = await listRes.json();
  const messages: { id: string; threadId: string }[] = listData.messages || [];

  const detailedMessages: GmailMessageItem[] = [];

  for (const msg of messages.slice(0, 5)) {
    try {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers: { name: string; value: string }[] = msgData.payload?.headers || [];
        const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
        const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';

        detailedMessages.push({
          id: msg.id,
          threadId: msg.threadId,
          snippet: msgData.snippet || '',
          subject,
          from,
          date,
        });
      }
    } catch (e) {
      console.warn('Error fetching individual Gmail message detail:', e);
    }
  }

  return detailedMessages;
}

// ==========================================
// 4. GOOGLE CALENDAR API INTEGRATION
// ==========================================
export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  hangoutLink?: string;
  htmlLink?: string;
  status?: string;
}

export async function fetchCalendarEvents(token?: string): Promise<CalendarEventItem[]> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const now = new Date().toISOString();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      now
    )}&maxResults=15&orderBy=startTime&singleEvents=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Calendar API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function createCalendarEvent(
  summary: string,
  description: string,
  startDateTime: string, // ISO string or YYYY-MM-DDTHH:mm:ss
  endDateTime: string,
  attendeeEmail?: string,
  token?: string
): Promise<CalendarEventItem> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const body: any = {
    summary,
    description,
    start: { dateTime: new Date(startDateTime).toISOString() },
    end: { dateTime: new Date(endDateTime).toISOString() },
    conferenceData: {
      createRequest: {
        requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  if (attendeeEmail) {
    body.attendees = [{ email: attendeeEmail }];
  }

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Create Calendar Event API error (${res.status}): ${errText}`);
  }

  return res.json();
}

export async function deleteCalendarEvent(eventId: string, token?: string): Promise<void> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 204) {
    const errText = await res.text();
    throw new Error(`Delete Calendar Event API error (${res.status}): ${errText}`);
  }
}

// ==========================================
// 5. GOOGLE FORMS API INTEGRATION
// ==========================================
export interface GoogleFormItem {
  formId: string;
  info: {
    title: string;
    documentTitle: string;
    description?: string;
  };
  responderUri?: string;
}

export async function createGoogleForm(
  title: string,
  description: string,
  token?: string
): Promise<GoogleFormItem> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const res = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle: title,
        description,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Forms API error (${res.status}): ${errText}`);
  }

  return res.json();
}

export async function fetchGoogleFormResponses(formId: string, token?: string): Promise<any> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) throw new Error('Google Workspace authentication required.');

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Forms Responses API error (${res.status}): ${errText}`);
  }

  return res.json();
}
