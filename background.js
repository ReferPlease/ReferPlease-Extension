var res;

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
      //sendResponse(200);

      fetch("https://www.referplease.com/api/thirdparty/post/save", requestOptions)
        .then(response => res = response)
        .then(response => sendResponse(response.status))
        .catch(error => console.log('error', error));

    }
    return true;
  }
);

let userdata = {
  isLoggedIn: false
};

chrome.runtime.onMessage.addListener(async function (message, callback) {
  if (message === "try") {
    let user = await fetchUser();
    userdata = user;
    chrome.extension.sendMessage({
      type: "user",
      data: user
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "userdata", data: userdata }, function (response) {
        console.log(response);
      });
    });
    console.log(user);
  }
});

async function fetchUser() {
  let user = await fetch(`https://www.referplease.com/api/profile`,
    { method: "POST", credentials: "include" }
  );
  return await user.json();
}