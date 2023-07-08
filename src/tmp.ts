import OciPolicy from './index';

const p1 = OciPolicy.allow('any-user')
  .in('compartment id', 'qweqwe', 'asd', 'asd')
  .toStatement();
const p2 = OciPolicy.allow('group id', 'nameA', 'nameB')
  .in('compartment', 'q', 'b')
  .toStatement();

console.log(p1);
console.log('\n\n');
console.log(p2);
