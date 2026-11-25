// Turns new Google Form responses (published CSV) into scan issues, so form submissions get the
// same review and auto-credit as GitHub ones. The video link stays private in the response sheet.

/** Minimal RFC 4180 CSV parser: quoted fields, escaped quotes, newlines inside quotes. */
function parseCsv(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(v => v.trim()));
}

/** Header row + data rows -> objects keyed by question title. */
function responses(text) {
  const [header, ...rows] = parseCsv(text);
  if (!header) return [];
  return rows.map((r, i) => Object.fromEntries(header.map((h, j) => [h.trim(), (r[j] || '').trim()]).concat([['_row', String(i + 2)]])));
}

const marker = r => `<!-- form-response: ${r['Timestamp']} -->`;

/** Issue body in the same "### Question" shape the GitHub form produces, minus the video link. */
function issueBody(r) {
  const answer = v => v || '_No response_';
  return [
    `### Place\n\n${answer(r['Place'])}`,
    `### Floor, room or entrance\n\n${answer(r['Floor, room or entrance'])}`,
    `### Video link\n\nPrivate: row ${r._row} of the "Campus Mesh scan responses" sheet.`,
    `### Name to credit\n\n${answer(r['Name to credit'])}`,
    `### Source\n\nGoogle Form ${marker(r)}`,
  ].join('\n\n');
}

module.exports = { parseCsv, responses, issueBody, marker };
