let loggedIn = document.getElementById("loggedIn");
let loggedOut = document.getElementById("loggedOut");
let logOutButton = document.getElementById("logout_button");
let user = null;
let _try = document.getElementById("try");
let imageElement = document.getElementById("imageurl");
let nameElement = document.getElementById("username");
let showspreadElement = document.getElementById("showspread");

showspreadElement.addEventListener("change", e => {
    let checked = showspreadElement.checked;
    console.log(checked);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "spread", data: { spread: checked } }, console.log);
    });
});


logOutButton.addEventListener("click", (ev) => {
    /*chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "removeSpread", data: null }, console.log);
    });*/
});
/*_try.onclick = (ev) => {
    chrome.extension.sendMessage("try");
}*/

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
    imageElement.src = user.imageUrl;
    nameElement.textContent = `${user.firstName} ${user.lastName ? user.lastName : ""}`
    loggedIn.classList.remove("hide");
    loggedOut.classList.add("hide");
}

function setLoggedOut() {
    loggedOut.classList.remove("hide");
    loggedIn.classList.add("hide");
}

chrome.extension.onMessage.addListener(function (msg, callback) {
    let { data, type } = msg;
    if (type === "user") {
        setUser(data);
    }
});

function initialise() {
    chrome.extension.sendMessage("getuser");
    chrome.extension.sendMessage("try");
    let checked = showspreadElement.checked;
    let local = localStorage.getItem("spread");
    if (local) {
        checked = JSON.parse(local);
    }
    else {
        localStorage.setItem("spread", JSON.stringify(checked));
    }
    showspreadElement.checked = checked;
}

initialise();