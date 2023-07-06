import OciPolicy from './index';

const p1 = OciPolicy.allow('any-user').in('compartment id', 'qweqwe').build();
const p2 = OciPolicy.allow('group', 'nameA', 'nameB')
  .in('compartment', 'q', 'b')
  .build();

console.log(p1);
console.log('\n\n');
console.log(p2);
