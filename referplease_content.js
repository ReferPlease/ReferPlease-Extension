const customEvent = new CustomEvent('referpleaseExtensionCheckEvent', {
    detail: {
        extensionInstalled: true
    } // whatever value you enter here will be passed in the event
});

function refreshonpostjob() {
    chrome.runtime.onMessage.addListener(function (message, callback) {
        //console.warn('content runtime', message);
        let { type } = message;
        console.log(message);
        //console.warn("data", data);
        switch (type) {
            case "refresh": {
                window.location.reload();
                break;
            }
            default: {
                //console.warn("Unhandled message", message);
                break;
            }
        }
        return true;
    });
}

function __REFERPLEASE_start() {
    document.dispatchEvent(customEvent);
    refreshonpostjob();
}