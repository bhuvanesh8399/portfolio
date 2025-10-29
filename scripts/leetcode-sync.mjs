// LeetCode sync script: fetch recent AC submissions and enrich with difficulty/topics
// Usage: node scripts/leetcode-sync.mjs
// Env: LC_USERNAME (defaults to bhuvanesh_0326)

import fs from 'node:fs/promises';

const USER = process.env.LC_USERNAME || 'bhuvanesh_0326';
const OUT_JS = 'assets/problem-solving-inline.js';
const MAX_ITEMS = Number(process.env.LC_MAX_ITEMS || 50);

async function gql(query, variables) {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'referer': 'https://leetcode.com' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error('GraphQL error: ' + res.status);
  const json = await res.json();
  if (json.errors) throw new Error('GraphQL errors: ' + JSON.stringify(json.errors));
  return json.data;
}

async function fetchRecent(username) {
  const q = `query recent($username:String!){ recentAcSubmissionList(username:$username){ id title titleSlug timestamp } }`;
  const data = await gql(q, { username });
  return (data?.recentAcSubmissionList || []).slice(0, MAX_ITEMS);
}

async function fetchQuestion(slug) {
  const q = `query question($titleSlug:String!){ question(titleSlug:$titleSlug){ difficulty topicTags{ name } } }`;
  const data = await gql(q, { titleSlug: slug });
  return data?.question || {};
}

function toISODate(ts) {
  try { return new Date(Number(ts) * 1000).toISOString().slice(0,10); } catch { return new Date().toISOString().slice(0,10); }
}

async function run() {
  console.log('LeetCode sync: user=', USER);
  const recent = await fetchRecent(USER);
  // unique by titleSlug (most recent first)
  const seen = new Set();
  const compact = recent.filter(x => { if (seen.has(x.titleSlug)) return false; seen.add(x.titleSlug); return true; });
  const items = [];
  for (const r of compact) {
    try {
      const q = await fetchQuestion(r.titleSlug);
      const difficulty = (q.difficulty || '').toLowerCase();
      const topics = (q.topicTags || []).map(t => t.name.toLowerCase());
      items.push({
        id: r.id || r.titleSlug,
        title: r.title,
        platform: 'leetcode',
        difficulty: ['easy','medium','hard'].includes(difficulty) ? difficulty : 'medium',
        tags: topics,
        link: `https://leetcode.com/problems/${r.titleSlug}/`,
        status: 'solved',
        timeMins: null,
        date: toISODate(r.timestamp),
        notes: ''
      });
    } catch (e) {
      // fallback with minimal info
      items.push({
        id: r.id || r.titleSlug,
        title: r.title,
        platform: 'leetcode',
        difficulty: 'medium',
        tags: [],
        link: `https://leetcode.com/problems/${r.titleSlug}/`,
        status: 'solved',
        timeMins: null,
        date: toISODate(r.timestamp),
        notes: ''
      });
    }
  }

  // Build seed JS to populate localStorage on page load
  const payload = { schema: 'ps-v1', updatedAt: new Date().toISOString(), items };
  const json = JSON.stringify(payload);
  const js = `(function(){try{localStorage.setItem('ps:entries:v1', ${JSON.stringify(json)});}catch(e){}})();\n`;
  await fs.writeFile(OUT_JS, js, 'utf8');
  console.log(`Wrote ${items.length} items to ${OUT_JS}`);
}

run().catch(err => { console.error(err); process.exit(1); });

