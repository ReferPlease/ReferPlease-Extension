let loggedInContainer = document.getElementById("logged__in__container");
let loggedOutContainer = document.getElementById("logged__out__container");
let loginButton = document.getElementById("login__button");
let user = null;
let _try = document.getElementById("try");
let userProfileImageElement = document.getElementById("user__profile__image");
let userNameElement = document.getElementById("user__username");
let toggleSpreadElement = document.getElementById("spread__toggler");

//----------------------------------------------------------------------------
//                    Show/Hide Spead Button Handler
//----------------------------------------------------------------------------
toggleSpreadElement.addEventListener("change", (e) => {
  let checked = toggleSpreadElement.checked;
  console.log("Spread value", checked);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "spread",
      data: { spread: checked },
    });
  });
});

loginButton.addEventListener("click", (ev) => {
  /*chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "removeSpread", data: null }, console.log);
    });*/
});
/*_try.onclick = (ev) => {
    chrome.runtime.sendMessage("try");
}*/

function setUser({ firstName, lastName, isLoggedIn, imageUrl }) {
  user = {
    firstName,
    lastName,
    isLoggedIn,
    imageUrl,
  };
  if (user.isLoggedIn) setLoggedIn();
  else setLoggedOut();
}

function setLoggedIn() {
  userProfileImageElement.src = user.imageUrl;
  userNameElement.textContent = `${user.firstName} ${
    user.lastName ? user.lastName : ""
  }`;
  loggedInContainer.classList.remove("hide");
  loggedOutContainer.classList.add("hide");
}

function setLoggedOut() {
  loggedOutContainer.classList.remove("hide");
  loggedInContainer.classList.add("hide");
}

chrome.runtime.onMessage.addListener(function (msg, callback) {
  let { data, type } = msg;
  if (type === "user") {
    setUser(data);
  }
  callback("done #56");
  return true;
});

function initialiseExtension() {
  chrome.runtime.sendMessage("getuser");
  chrome.runtime.sendMessage("try");
  let checked = toggleSpreadElement.checked;
  let local = localStorage.getItem("spread");
  if (local) {
    checked = JSON.parse(local);
  } else {
    localStorage.setItem("spread", JSON.stringify(checked));
  }
  toggleSpreadElement.checked = checked;
}

initialiseExtension();
