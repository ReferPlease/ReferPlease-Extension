var res;
let initialised = false;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request, sendResponse, sender, 'here');
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.postUrl) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("mode", "no-cors");

      var raw = JSON.stringify(request);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      console.log('for me', request, sender, sendResponse);
      fetch("https://www.referplease.com/api/thirdparty/post/save", requestOptions).then(res => {
        sendResponse(res.status);
        refresh_referplease_page();
      }).catch(err => {
        console.error(err);
        sendResponse(500);
      });
    }
    return true;
  }
);

let userdata = {
  isLoggedIn: false
};
let isAdmin = false;
let unmoderatedCount = 1;

function updateUser(data) {
  userdata = data;
  if (userdata.isLoggedIn) {
    isAdmin = userdata.roles.map(x => x.authority).includes("ROLE_ADMIN");
  }
  else {
    isAdmin = false;
  }
}

chrome.runtime.onMessage.addListener(async function (message, callback) {
  console.log("recieved", message);
  if (message === "try") {
    let user = await fetchUser();
    updateUser(user);
    initialised = true;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log(tabs);
      chrome.tabs.sendMessage(tabs[0].id, { type: "userdata", data: userdata }, function (response) {
        console.log(response);
      });
    });
    console.log(user);
  }
  if (message === "getuser") {
    fetchUser().then(user => {
      updateUser(user);
      initialised = true;
      chrome.runtime.sendMessage({
        type: "user",
        data: userdata
      });
    }).catch(console.error);
    chrome.runtime.sendMessage({
      type: "user",
      data: userdata
    });
  }
  return true;
});

async function fetchUser() {
  let user = await fetch(`https://www.referplease.com/api/profile`,
    { method: "POST", credentials: "include" }
  );
  return await user.json();
}

async function getUnmoderatedPostCount() {
  let myHeaders = new Headers();
  myHeaders.append("REQUEST_SOURCE", "EXT");
  let res = await fetch(`https://www.referplease.com/api/post/unmoderated/count`,
    { method: "POST", credentials: "include", headers: myHeaders }
  );
  if (res.ok) {
    let json = await res.json();
    unmoderatedCount = json;
    return unmoderatedCount;
  }
  unmoderatedCount = 0;
  return unmoderatedCount;
}

function updateBadge() {
  let ba = chrome.action;

  function removeBadge() {
    ba.setBadgeBackgroundColor({ color: "#DD4F43" });
    ba.setBadgeText({ text: '' });   // <-- set text to '' to remove the badge
  }

  function addBadge(count) {
    if (count <= 0) return removeBadge();
    ba.setBadgeBackgroundColor({ color: "#DD4F43" });
    ba.setBadgeText({ text: '' + count });
  }

  getUnmoderatedPostCount().then(() => {
    addBadge(unmoderatedCount);
  }).catch((e) => {
    console.error(e);
    removeBadge();
  });
}

function refresh_referplease_page() {
  console.log('refresh');
  chrome.tabs.query({ url: "http://localhost:3000/*" }, function (tabs) {
    console.log(tabs);
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: "refresh" }, function (response) {
        console.log(response);
      });
    });
  });
}

setInterval(updateBadge, 3600 * 1000);

updateBadge();