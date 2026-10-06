const { kv } = require('@vercel/kv');

const KV_KEY = 'trackerState';

const DEFAULT_STATE = {
  nextId: 3,
  filter: { program: 'all', campus: 'all', status: 'all', q: '' },
  dailyTasks: [],
  pendingStudents: [],
  batches: [
    {
      id: 2,
      name: '26 June M(A)',
      program: 'ECA',
      campus: 'Mississauga',
      expanded: true,
      example: false,
      createdAt: '2026-10-06T00:56:31.338Z',
      sections: {
        part1: {
          assignmentSubmissions: { done: false, note: '' },
          placementBooklet: { done: false, note: '' },
          attendanceMarking: { done: false, note: '' }
        },
        part2: {
          assignmentSubmissions: { done: false, note: '' },
          attendanceForms: { done: false, note: '' },
          attendanceMarking: { done: false, note: '' }
        }
      }
    },
    {
      id: 1,
      name: '21 July M(A)',
      program: 'PSW',
      campus: 'Mississauga',
      expanded: true,
      example: true,
      createdAt: '2026-07-21T00:00:00.000Z',
      sections: {
        performance: {
          dates: { done: true, note: 'Jul 21\u201325' },
          instructor: { done: true, note: 'J. Grant' },
          grades: { done: false, note: '' }
        },
        moodle: {
          submissions: { done: true, note: '18/20 in' },
          grading: { done: true, note: '' }
        },
        rewrites: { done: false, note: '' },
        attendance: { done: true, note: 'Confirmed with instructor' }
      }
    }
  ]
};

function checkSecret(req) {
  const required = process.env.TRACKER_SECRET;
  if (!required) return true; // no secret configured — open access (fine for a personal, unlisted URL)
  const given = req.headers['x-tracker-secret'];
  return given === required;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Tracker-Secret');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (!checkSecret(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const state = await kv.get(KV_KEY);
      res.status(200).json(state || DEFAULT_STATE);
    } catch (e) {
      res.status(500).json({ error: 'kv_read_failed', message: String(e && e.message || e) });
    }
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        res.status(400).json({ error: 'invalid_body' });
        return;
      }
      await kv.set(KV_KEY, body);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'kv_write_failed', message: String(e && e.message || e) });
    }
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
