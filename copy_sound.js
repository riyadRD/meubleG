const fs = require('fs');
fs.copyFileSync('public/sounds/Notification.wav', 'public/sounds/notification.mp3');
console.log('File copied successfully.');
