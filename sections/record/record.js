const settings = require('electron-settings')
const $ = require('jQuery')
const ipc = require('electron').ipcRenderer;

//#1 - Get Main APP content, downloaded at start app
const APP_CONTENT = settings.get('content');

//#2 - Add Event Listener on click to popup de dialog with Contact
const contactBtn = document.getElementById('record-contact-btn');
contactBtn.addEventListener('click', (event) => {
    
    if($('#record-contact-btn').hasClass('record-contact-opened')){

        //close contact
        $('#record-contact-btn').removeClass('record-contact-opened');
        $('#record-contact-details').addClass('hidden');
        $('#record-contact-title').removeClass('hidden');
        //change chevron direction
        $('#record-contact-chevron').removeClass('fa-chevron-down');
        $('#record-contact-chevron').addClass('fa-chevron-up');

    }else{

        //open contact
        $('#record-contact-btn').addClass('record-contact-opened');
        $('#record-contact-details').removeClass('hidden');
        $('#record-contact-title').addClass('hidden');
        //change chevron direction
        $('#record-contact-chevron').removeClass('fa-chevron-up');
        $('#record-contact-chevron').addClass('fa-chevron-down');
        
    }
    

});



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
