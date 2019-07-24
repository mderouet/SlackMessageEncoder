document.getElementById("passwordButton").addEventListener("click", sendPassword);

function sendPassword() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, document.getElementById("passwordTextArea").value);
        });
    });
}