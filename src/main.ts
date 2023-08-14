import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { exec } from 'node:child_process';
import { writeFile } from 'fs';

const binary_location = path.join(__dirname, '../assets/spreadsheet');
const proc = exec(binary_location, function (error, _stdout, _stderr) {
    if (error) {
        console.log("Failed to execute binary.", error);
    }
});
function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // replace existing plot.html and table.html with empty files

    writeFile(
        path.join(__dirname, "../table.html"),
        "<div style='margin: 10px;'>Get started by executing commands! To learn more about commands, <a href=\"https://github.com/dvishal485/spreadsheet-for-dummies/\">visit github repository</a>.</div>",
        function (err) {
            if (err) {
                console.log(err);
            }
        });

    writeFile(path.join(__dirname, "../plot.html"), "This spreadsheet program contains all the below mentioned features:<br/><ul><li>Data arranged in rows and columns<li>Dummy programming language(work in progress)</li><li>Auto correct support for basic commands</li><li>Compile code to csv Interpreter(repl)</li><li>Support of closures(alpha stage)</li><li>ChatGPT integration with provided data</li></ul>", function (err) {
        if (err) {
            console.log(err);
        }
    });
    const write_to_output = (data: string): void => {
        data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
        data = data.split("[93m").join("<span class=\"red\">");
        data = data.split("[91m").join("<span class=\"yellow\">");
        data = data.split("[96m").join("<span class=\"cyan\">");
        data = data.split("[1m").join("<span class=\"bold\">");
        data = data.split("[0m").join("</span>");
        mainWindow.webContents.send("output-buffer", data);
    };
    proc.stdout.on('data', write_to_output);
    proc.stderr.on('data', write_to_output);



    ipcMain.handle("input-buffer", (_event, args: string) => {
        const handled: boolean = proc.stdin.write(args + "\nrender\n",
            err => {
                if (err) {
                    console.log(err);
                }
            });
        if (!handled) {
            console.log("Failed to write to stdin! Backend may have crashed.");
            app.quit();
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        // use ctrl+c to quit
        proc.stdin.write("\x03");
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
