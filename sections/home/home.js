const settings = require('electron-settings')
const $ = require('jQuery')
const ipc = require('electron').ipcRenderer;

//#1 - Get Main APP content, downloaded at start app
const APP_CONTENT = settings.get('content');

//#2 - Handler to click "+" to show details
$('.home-details-more').click(function(){
    //#1 - Get the filter index from this option
    let houseId = $(this).data("house-id");

    showHouseDetails(houseId);
})


/******************************
 **********IPC Section*********
 ******************************/

//#A - Handler when house details is clicked [IPC sender]
function showHouseDetails(houseId){
    ipc.send('ipc-show-house-detail', houseId);
}



console.log(APP_CONTENT);
