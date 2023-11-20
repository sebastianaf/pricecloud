import { spawn } from 'child_process';

const migrationName: string = process.argv[2];
const command: string = `npm run typeorm -- migration:generate -d "./src/database/datasource.ts" "./src/database/migrations/${migrationName}"`;

const [cmd, ...args] = command.split(' ');

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: true,
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Exit with code ${code}`);
  } else {
    console.log('Success!');
  }
});
