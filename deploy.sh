#!/bin/bash
rm -rf ./dist
rm -rf node_modules/
rm -rf package-lock.json

npm install && npm audit fix --force

ng build --configuration=production

sudo rm -rf /usr/share/nginx/html/pix-morpher
sudo cp -r ./dist/* /usr/share/nginx/html/pix-morpher

