var res;
let GLOBAL_EXTENSION_INITIALIZED = false;
let userdata = {
  isLoggedIn: false,
};
let isAdmin = false;
let unmoderatedCount = 1;
const REFERPLEASE_HOST_URL = "https://www.referplease.com";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, sendResponse, sender, "here");
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  //-----------------------------------------------------------------------------
  //                          Share a Post
  //-----------------------------------------------------------------------------
  if (request.postUrl) {
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify(request),
      redirect: "follow",
    };
    console.log("Share Post Request: ", request, sender, sendResponse);
    try {
      const res = fetch(
        REFERPLEASE_HOST_URL + "/api/thirdparty/post/save",
        requestOptions
      );
      console.log(res);
      res.then(r => {
        sendResponse(r.status);
        refresh_referplease_page();
      }).catch(err => {
        sendResponse(null);
      });
    } catch (err) {
      console.error(err);
      sendResponse(500);
    }
  }
  return true;
});

function updateUser(data) {
  userdata = data;
  if (userdata.isLoggedIn) {
    isAdmin = userdata.roles.map((x) => x.authority).includes("ROLE_ADMIN");
  } else {
    isAdmin = false;
  }
}

chrome.runtime.onMessage.addListener(async function (message, callback) {
  console.log("recieved", message);
  if (message === "try") {
    let user = await fetchUser();
    updateUser(user);
    GLOBAL_EXTENSION_INITIALIZED = true;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log(tabs);
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: "userdata", data: userdata }, function (response) {
        console.log(response);
      });
    });
    console.log(user);
  }
  if (message === "getuser") {
    try {
      const user = await fetchUser();
      updateUser(user);
      GLOBAL_EXTENSION_INITIALIZED = true;
      chrome.runtime.sendMessage({
        type: "user",
        data: userdata,
      });
    } catch (err) {
      console.log(err); //Error fetching the user TODO: Show user an alert of error
    }
  }
  return true;
});

async function fetchUser() {
  let user = await fetch(REFERPLEASE_HOST_URL + `/api/profile`, {
    method: "POST",
    credentials: "include",
  });
  return await user.json();
}

async function getUnmoderatedPostCount() {
  let res = await fetch(REFERPLEASE_HOST_URL + `/api/post/unmoderated/count`, {
    method: "POST",
    credentials: "include",
    headers: {
      REQUEST_SOURCE: "EXT",
    },
  });
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
    ba.setBadgeText({ text: "" }); // <-- set text to '' to remove the badge
  }

  function addBadge(count) {
    console.log("Baddgeeee", { text: "" + count });
    if (count <= 0) return removeBadge();
    ba.setBadgeBackgroundColor({ color: "#DD4F43" });
    ba.setBadgeText({ text: "" + count });
  }
  getUnmoderatedPostCount()
    .then((count) => {
      addBadge(count);
    })
    .catch((err) => {
      console.error(err);
      removeBadge();
    });
}

function refresh_referplease_page() {
  console.log("refresh");
  chrome.tabs.query({ url: REFERPLEASE_HOST_URL + "/*" }, function (tabs) {
    console.log(tabs);
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { type: "refresh" }, function (response) {
        console.log(response);
      });
    });
  });
}

setInterval(updateBadge, 3600 * 1000);

updateBadge();
