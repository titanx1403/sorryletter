const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function trackVisit() {
  try {
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

    const response = await fetch(`${API_URL}/api/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        deviceType,
      }),
    });

    const data = await response.json();
    return data.visitId || null;
  } catch (err) {
    console.log('Tracking unavailable (server might be offline)');
    return null;
  }
}

export async function updateVisit(visitId, updates) {
  if (!visitId) return;

  try {
    await fetch(`${API_URL}/api/visit/${visitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch (err) {
    // Silent fail - tracking is non-critical
  }
}
