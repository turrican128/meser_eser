const API_BASE = 'https://heb.mesereser.com/Services/JsonServices.aspx';

// TODO: confirm the actual function name for fetching a contact in the API docs.
const GET_CONTACT_FN = 'GetContact';
const CREATE_CONTACT_FN = 'CreateContact';

const MOCK_LATENCY_MS = 300;

export class ApiConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiConfigError';
  }
}

// Mock mode is allowed in dev always, and in production builds when the
// VITE_ALLOW_MOCK env var is set to '1' (e.g., on a demo deploy that has no
// real CRM credentials yet). Other production builds keep mocks fully out.
function isMockAllowed() {
  return Boolean(import.meta.env.DEV) || import.meta.env.VITE_ALLOW_MOCK === '1';
}

function getMockName() {
  if (typeof window === 'undefined') return null;
  if (!isMockAllowed()) return null;
  const value = new URLSearchParams(window.location.search).get('mock');
  if (!value) return null;
  // ?mock=1 picks the default demo; ?mock=<name> picks that file.
  return value === '1' ? '' : value;
}

// Dynamic import keeps the json-input-demos folder out of bundles where
// mocks are disallowed.
async function loadMockContact(name) {
  if (!isMockAllowed()) return null;
  const { getDemo } = await import('../json-input-demos/index.js');
  return getDemo(name);
}

function getApiKey() {
  const key = import.meta.env.VITE_MESERESER_API_KEY;
  if (!key) {
    throw new ApiConfigError('VITE_MESERESER_API_KEY is not set. Add it to .env.local.');
  }
  return key;
}

async function apiCall(functionName, payload) {
  const url = `${API_BASE}?f=${encodeURIComponent(functionName)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ApiKey: getApiKey(),
    },
    body: JSON.stringify(payload ?? {}),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  if (String(data.ErrorCode) !== '0') {
    throw new Error(data.Result || `API error (code ${data.ErrorCode})`);
  }
  return data;
}

export async function getContact(id) {
  const mockName = getMockName();
  if (mockName !== null) {
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    const mock = await loadMockContact(mockName);
    return { ...mock };
  }
  const data = await apiCall(GET_CONTACT_FN, { Id: id });
  return data.Result;
}

export async function createContact(payload) {
  const mockName = getMockName();
  if (mockName !== null) {
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    console.log('[mock] CreateContact payload:', payload);
    return 'OK';
  }
  const data = await apiCall(CREATE_CONTACT_FN, payload);
  return data.Result;
}
