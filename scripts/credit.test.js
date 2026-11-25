const assert = require('assert');
const { field, clean, addCredit } = require('./credit');

const body = '### Place\n\nBlock A\n\n### Video link\n\nhttps://x\n\n### Name to credit\n\nAma Owusu\n\n### Agreement\n\n- [X] ok';
assert.strictEqual(field(body, 'Place'), 'Block A');
assert.strictEqual(field(body, 'Name to credit'), 'Ama Owusu');
assert.strictEqual(field('### Name to credit\n\n_No response_', 'Name to credit'), '');
assert.strictEqual(clean('Ama [x](http://evil) <b>\nhi'), 'Ama b hi');
assert.strictEqual(clean('Kofi www.spam.com'), 'Kofi');

const start = '# Contributors\n\n## Maintainers\n- me\n\n## Campus scans\n<!-- c -->\n_Be the first: [submit](x)._\n';
const once = addCredit(start, 'Ama', 'Block A');
assert.ok(once.includes('- Ama (Block A)'));
assert.ok(!once.includes('Be the first'));
assert.strictEqual(addCredit(once, 'Ama', 'Block A'), null, 'no duplicates');
assert.ok(addCredit(once, 'Kofi', 'GE Block').includes('- Kofi (GE Block)'));
assert.strictEqual(addCredit(start, '', 'Block A'), null, 'anonymous gets no line');
console.log('credit tests passed');
