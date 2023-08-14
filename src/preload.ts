// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("API", {
    send_input: (args: string): Promise<void> => {
        ipcRenderer.invoke("input-buffer", args);
        return;
    },
    on_output: (callback: (data: string) => void): void => {
        ipcRenderer.on("output-buffer", (event, args) => callback(args));
    }
});

/* window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
    }
}); */
