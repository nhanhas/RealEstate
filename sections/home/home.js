const settings = require('electron-settings')
const $ = require('jQuery')

//#1 - Get Main APP content, downloaded at start app
const APP_CONTENT = settings.get('content');






console.log(APP_CONTENT);
