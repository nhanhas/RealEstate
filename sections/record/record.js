const settings = require('electron-settings')
const $ = require('jQuery')
const ipc = require('electron').ipcRenderer;

//#1 - Get Main APP content, downloaded at start app
const APP_CONTENT = settings.get('content');


//#A - Responsible to build entire view based on house id 
//received from ipc [home.js > main.js > record.js]
function renderHouseDetail(houseId){
    
    //#FINAL# - Show entire details!
    $('#home-section').css('display', 'none');
    $('#record-section').css('display', 'block');

}

//#B - Responsible to return to Home view, closing details
//received from ipc [navbar.js > main.js > record.js]
function closeHouseDetail(){
    
    //#FINAL# - Show home!
    $('#home-section').css('display', 'block');
    $('#record-section').css('display', 'none');
    
}


/******************************
 **********IPC Section*********
 ******************************/

//#IPC handler when client click "+" at Home
ipc.on('showHouseDetail', function (event, houseId) {
    
    //#1 - Call main function responsible to render details
    renderHouseDetail(houseId);
    
});

//#IPC handler when client click "Back" at Navbar
ipc.on('closeHouseDetail', function (event, houseId) {
    
    //#1 - Call main function responsible to render home
    closeHouseDetail();
    
});
