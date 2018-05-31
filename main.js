const electron = require('electron');
const settings = require('electron-settings');
const fs = require('fs');
const url = require('url');
const path = require('path');

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
    //#1 - Check if exists internet Connection
    //TODO

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