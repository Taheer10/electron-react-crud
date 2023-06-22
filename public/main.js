const { app, BrowserWindow, ipcMain } = require("electron");
const {
  readJSONFile,
  addDataToJSONFile,
  updateDataInJSONFile,
  deleteDataFromJSONFile,
} = require("../src/jsonFileUtils");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html from a URL.
  win.loadURL("http://localhost:3000");

  // Open the DevTools.
  win.webContents.openDevTools();
}

ipcMain.on("request-mainprocess-action", (event, action, ...args) => {
  if (action === "read") {
    const data = readJSONFile("./src/data.json");
    event.reply("mainprocess-response", data);
  } else if (action === "add") {
    const [newData] = args;
    addDataToJSONFile("./src/data.json", newData);
    event.reply("mainprocess-response", "Data added successfully");
  } else if (action === "edit") {
    const [id, newName, newDescription] = args;
    updateDataInJSONFile("./src/data.json", id, newName, newDescription);
    event.reply("mainprocess-response", "Data updated successfully");
  } else if (action === "delete") {
    const [id] = args;
    deleteDataFromJSONFile("./src/data.json", id);
    event.reply("mainprocess-response", "Data deleted successfully");
  }
});

app.whenReady().then(createWindow);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
