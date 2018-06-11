const electron = require('electron');
const settings = require('electron-settings');
const fs = require('fs');
const url = require('url');
const path = require('path');
const request = require('request');
const ipc = require('electron').ipcMain;


const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function(){
    
    //#1 - Download App Content from service
    //then start app after download
    getAppContent();

});

//App Config (Sizes, icons and content)
function mainAppStartup(){
    //#1 - Create App Skeleton 
    const windowOptions = {
        width: 1900,
        height : 860,
        title: app.getName()    
    }

    //#2 - Set app icon
    windowOptions.icon = path.join(__dirname, '/assets/app-icon/icon.png');

    //#3 - Create Main Window
    mainWindow = new BrowserWindow(windowOptions);

    //#4 - Load index html
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, 'index.html'),
        protocol : 'file',
        slashes : true
    }));

    //#5 - Build Main Menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //#5.1 - Load Main Menu 
    Menu.setApplicationMenu(mainMenu);
}

//App content (download or local)
function getAppContent(){

    //#A - This aux function to read it from Disk
    var readContentFromDisk = function(){
        //#2 - At this point, it must be stored in content.json
        let contentFile = path.join(__dirname, '/content/content.json');
        
        //#3 - Read Content
        fs.readFile(contentFile, 'utf-8', (err, data) => {
            if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            //#4 - store it in electron-settings
            settings.set('content', JSON.parse(data));

            //#5 - Now lauch app!
            mainAppStartup();
        });
    }

    //#1 - Try to GET from Server
    let contentURL = "http://vps152961.ovh.net/imobiliaria/api/?section=imobiliaria&author=1";
    //#1.1 - Make get now
    request(contentURL, { json: true }, (err, res, body) => {
        if (err) { 
            console.log('There is no connection to server. Using Offline mode...');
            readContentFromDisk();
            return false; 
        }
        
        //#1.2 - if there is no error, store it [and read it in case of fail]
        let contentFile = path.join(__dirname, '/content/content.json');
        let jsonData = JSON.stringify(body);
        fs.writeFile(contentFile, jsonData, function(err) {
            if (err) {
                //Error on Save
                console.log(err);
                readContentFromDisk();
                return false;
            }
        });

        //#1.3 - After update the content, read it from disk
        readContentFromDisk();
    });

    
    
    
}

//Main App Menu
const mainMenuTemplate = [
    {
        label : 'Application',
        submenu : [
            {
                label : 'Quit',                
                accelerator : process.platform === 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu : [
            {
                label : 'Cut',
                accelerator : process.platform === 'darwin' ? 'Command + X' : 'Ctrl + X',
                selector: "cut:"
            },
            {
                label : 'Copy',
                accelerator : process.platform === 'darwin' ? 'Command + C' : 'Ctrl + C',
                selector: "copy:"
            },
            {
                label : 'Paste',
                accelerator : process.platform === 'darwin' ? 'Command + V' : 'Ctrl + V',
                selector: "paste:"
            },
            {
                label : 'Select All',
                accelerator : process.platform === 'darwin' ? 'Command + A' : 'Ctrl + A',
                selector: "selectAll:"
            }
        ]
    },
    {
        label : 'Develop',
        submenu : [
            {
                label : 'Reload',
                accelerator : process.platform === 'darwin' ? 'Command + R' : 'Ctrl + F5',
                click(item, focusedWindow){
                    mainWindow.reload();
                }
            },
            {
                label : 'Developer Tools',
                accelerator : process.platform === 'darwin' ? 'Command + i' : 'Ctrl + i',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }            
        ]
    }
];


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


//#IPC when user click "+" to show details 
ipc.on('ipc-show-house-detail', function (event, arg) {
    event.sender.send('showHouseDetail', arg);
});

//#IPC when user click "Back" on Navbar to close details
ipc.on('ipc-close-house-detail', function (event, arg) {
    event.sender.send('closeHouseDetail', arg);
})