const assert = require('assert');
const { parseCsv, responses, issueBody, marker } = require('./import-form');
const { field } = require('./credit');

assert.deepStrictEqual(parseCsv('a,b\n"x, y","say ""hi""\nthere"\n'), [['a', 'b'], ['x, y', 'say "hi"\nthere']]);
const csv = 'Timestamp,Place,"Floor, room or entrance",Video link,Name to credit,Agreement\r\n' +
            '25/11/2026 09:00:00,Block A,,https://drive/x,Ama,"a, b, c"\r\n';
const [r] = responses(csv);
assert.strictEqual(r['Place'], 'Block A');
assert.strictEqual(r._row, '2');
const body = issueBody(r);
assert.ok(!body.includes('https://drive/x'), 'video link must stay private');
assert.strictEqual(field(body, 'Name to credit'), 'Ama');
assert.strictEqual(field(body, 'Place'), 'Block A');
assert.ok(body.includes(marker(r)));
console.log('import tests passed');
