const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //backgroundColor: '#2e2c29',
    autoHideMenuBar: true,
    //opacity: 0.8,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./html/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
