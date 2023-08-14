// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

interface Window {
    API: {
        send_input: (args: string) => Promise<void>;
        on_output: (callback: (data: string) => void) => void;
    };
}
const code = document.getElementById("code");
const output = document.getElementById("output-area");
const table_iframe = document.getElementById("table");
const plot_iframe = document.getElementById("plot");
const run_button = document.getElementById("run");

function pipe_input(_event: Event): void {
    output.innerHTML = "Processing...";
    if (code instanceof HTMLTextAreaElement) {
        const value = code.value;
        window.API.send_input(value);
    }
}
const resize = (event: Event): void => {
    if (event.target instanceof HTMLTextAreaElement) {
        event.target.style.height = "1px";
        event.target.style.height = (25 + event.target.scrollHeight) + "px";
    }
};
run_button.addEventListener("click", pipe_input);
output.addEventListener("keyup", resize);

window.API.on_output((data: string) => {
    output.innerHTML += data;
    table_iframe.setAttribute("src", "table.html");
    plot_iframe.setAttribute("src", "plot.html");
});
