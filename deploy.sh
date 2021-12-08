cd /home/chris/resistance-online/
npm install
npm run build
pm2 delete resistance
pm2 start ./dist/app/index.js --name=resistance