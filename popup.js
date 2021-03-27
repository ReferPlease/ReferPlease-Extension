let loggedIn = document.getElementById("loggedIn");
let loggedOut = document.getElementById("loggedOut");
let user = null;
let _try = document.getElementById("try");

_try.onclick = (ev) => {
    chrome.extension.sendMessage("try");
} 


function setUser({ firstName, lastName, isLoggedIn, imageUrl }) {
    user = {
        firstName,
        lastName,
        isLoggedIn,
        imageUrl
    }
    if (user.isLoggedIn) setLoggedIn();
    else setLoggedOut();
}

function setLoggedIn() {
    loggedIn.classList.remove("hide");
    loggedOut.classList.add("hide");
}

function setLoggedOut() {
    loggedOut.classList.remove("hide");
    loggedIn.classList.add("hide");
}

chrome.extension.onMessage.addListener(function (msg, callback) {
    let { data, type } = JSON.parse(msg);
    if (type === "user") {
        setUser(data);
    }
});

chrome.extension.sendMessage("try");