const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function(){
    
    //#1 - Start the App
    mainAppStartup();
    
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

//Main App Menu
const mainMenuTemplate = [
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
            },
            {
                label : 'Quit',                
                accelerator : process.platform === 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];