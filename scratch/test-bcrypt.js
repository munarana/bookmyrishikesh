const bcrypt = require('bcryptjs');

async function test() {
  const pass = 'owner123';
  const hash = await bcrypt.hash(pass, 10);
  console.log('Plain:', pass);
  console.log('Hash:', hash);
  const match = await bcrypt.compare(pass, hash);
  console.log('Match self:', match);
  
  const dbHash = '$2b$10$7ccvKtoIrSrRCVdMOOeF7OUF5KbHFVyl7bNPUncQPS1sVSZuAs5eC';
  const dbMatch = await bcrypt.compare(pass, dbHash);
  console.log('Match DB:', dbMatch);
}

test();
