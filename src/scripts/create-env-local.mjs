import fs from 'fs';

const envLocalPath = '.env.local';

if (!fs.existsSync(envLocalPath)) {
  fs.writeFileSync(envLocalPath, '');
}
