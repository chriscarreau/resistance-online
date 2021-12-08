cd /home/chris/test3/
npm install
npm run build
pm2 stop resistance
pm2 start ./dist/app/index.js --name=resistance