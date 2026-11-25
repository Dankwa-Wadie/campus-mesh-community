// Adds the credited name from an accepted scan submission to CONTRIBUTORS.md.
// Pure functions are exported so they can be tested without GitHub.

/** Reads one answer from a GitHub issue-form body ("### Label\n\nanswer"). */
function field(body, label) {
  const m = (body || '').match(new RegExp(`###\\s*${label}\\s*\\n+([\\s\\S]*?)(?=\\n###|$)`));
  const v = m ? m[1].trim() : '';
  return v === '_No response_' ? '' : v;
}

/** Strips anything that could break the markdown list or inject links/HTML. */
function clean(s) {
  return s.replace(/[\r\n]+/g, ' ').replace(/\S*:\/\/\S*|www\.\S*/gi, '').replace(/[<>\[\]()`*_|#]/g, '')
    .replace(/\s{2,}/g, ' ').trim().slice(0, 60);
}

/** Returns the new CONTRIBUTORS.md text, or null when nothing should change. */
function addCredit(contributors, name, place) {
  if (!name) return null;
  const line = `- ${name} (${place || 'Campus'})`;
  if (contributors.includes(line)) return null;
  const marker = '## Campus scans';
  const at = contributors.indexOf(marker);
  if (at < 0) return null;
  const head = contributors.slice(0, at + marker.length);
  const rest = contributors.slice(at + marker.length)
    .replace(/\n_Be the first:[^\n]*\n?/, '\n'); // drop the placeholder once someone is credited
  return `${head}\n${line}${rest.startsWith('\n') ? rest : '\n' + rest}`.replace(/\n{3,}/g, '\n\n');
}

module.exports = { field, clean, addCredit };
