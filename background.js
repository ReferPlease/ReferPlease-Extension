var res;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.postUrl) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify(request);
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://referplease.com/thirdparty/post/save", requestOptions)
        .then(response => res = response)
        .then(response => sendResponse(response.status))
        .catch(error => console.log('error', error));

    }
    return true;
  }
);