const customEvent = new CustomEvent('referpleaseExtensionCheckEvent', {
    detail: {
        extensionInstalled: true
    } // whatever value you enter here will be passed in the event
});

function __REFERPLEASE_start() {
    document.dispatchEvent(customEvent);
}