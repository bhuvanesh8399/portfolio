export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const user = url.searchParams.get('user') || 'bhuvanesh_0326';
    const max = Math.min(Number(url.searchParams.get('max') || 50), 200);

    async function gql(query, variables) {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'referer': 'https://leetcode.com'
        },
        body: JSON.stringify({ query, variables })
      });
      if (!res.ok) throw new Error('LeetCode GraphQL error: ' + res.status);
      const json = await res.json();
      if (json.errors) throw new Error('LeetCode errors: ' + JSON.stringify(json.errors));
      return json.data;
    }

    try {
      const q1 = `query recent($username:String!){ recentAcSubmissionList(username:$username){ id title titleSlug timestamp } }`;
      const d1 = await gql(q1, { username: user });
      const recent = (d1?.recentAcSubmissionList || []).slice(0, max);
      const seen = new Set();
      const compact = recent.filter(x => { if (seen.has(x.titleSlug)) return false; seen.add(x.titleSlug); return true; });

      const items = [];
      for (const r of compact) {
        try {
          const q2 = `query question($titleSlug:String!){ question(titleSlug:$titleSlug){ difficulty topicTags{ name } } }`;
          const d2 = await gql(q2, { titleSlug: r.titleSlug });
          const diff = (d2?.question?.difficulty || '').toLowerCase();
          const tags = (d2?.question?.topicTags || []).map(t => t.name.toLowerCase());
          items.push({
            id: r.id || r.titleSlug,
            title: r.title,
            platform: 'leetcode',
            difficulty: ['easy','medium','hard'].includes(diff) ? diff : 'medium',
            tags,
            link: `https://leetcode.com/problems/${r.titleSlug}/`,
            status: 'solved',
            timeMins: null,
            date: new Date(Number(r.timestamp)*1000).toISOString().slice(0,10),
            notes: ''
          });
        } catch (e) {
          items.push({
            id: r.id || r.titleSlug,
            title: r.title,
            platform: 'leetcode',
            difficulty: 'medium',
            tags: [],
            link: `https://leetcode.com/problems/${r.titleSlug}/`,
            status: 'solved',
            timeMins: null,
            date: new Date(Number(r.timestamp)*1000).toISOString().slice(0,10),
            notes: ''
          });
        }
      }

      const payload = {
        schema: 'ps-v1',
        updatedAt: new Date().toISOString(),
        items
      };

      return new Response(JSON.stringify(payload), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=300',
          'access-control-allow-origin': '*'
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
  }
}

