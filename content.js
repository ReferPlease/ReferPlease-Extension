const postButtonContainerClass = "feed-shared-social-actions feed-shared-social-action-bar social-detail-base-social-actions feed-shared-social-action-bar--has-social-counts";
const POST_ID_REGEX = /(\d{19})/gm;
const COMPANY_URL_REGEX = /(company)|(miniCompany)/gmi;
let user = {
  isLoggedIn: false
};
let popupState = {
  spread: true,
};
let buttonsAdded = [];

const buttonMarkup = `<button class="message-anywhere-button send-privately-button artdeco-button artdeco-button--4 artdeco-button--tertiary  artdeco-button--muted " aria-label="Spread a message" type="button">
<li-icon aria-hidden="true" type="send-privately-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
<path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
</svg></li-icon>
<span class="artdeco-button__text">Spread</span>
</button>`

let linkedInProfileStartUrl = "https://www.linkedin.com/in/";
let linkedInProfileEndUrl = "?miniProfileUrn";


function updateUser(data, _popuState) {
  user = data;
  popupState = _popuState;
  //console.warn('update', user, popupState);
  if (user.isLoggedIn && popupState.spread) {
    if (buttonsAdded.length <= 0) return addButtons();
    return;
  }
  if (buttonsAdded.length > 0) removeButtons();
}

chrome.runtime.onMessage.addListener(function (message, callback) {
  //console.warn('content runtime', message);
  let { type, data } = message;
  //console.warn("data", data);
  switch (type) {
    case "userdata": {
      updateUser(data, popupState);
      break;
    }
    case "spread": {
      updateUser(user, data);
      break;
    }
    case "removeSpread": {
      updateUser({ isLoggedIn: false }, popupState);
      break;
    }
    default: {
      //console.warn("Unhandled message", message);
      break;
    }
  }
  return true;
});


// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName("body")[0];

function createButtonElement() {
  const container = document.createElement('div');
  container.innerHTML = buttonMarkup;
  return container;
}

function appendButtonToContainer(buttonContainer) {
  if (buttonContainer.classList.contains("__processed")) return;
  buttonContainer.classList.add("__processed");
  try {
    let ember = buttonContainer.closest('div[data-urn]');
    let hrefEl = ember.querySelector("a[data-control-name]");
    let href = hrefEl.href;
    //console.warn(href);
    if (COMPANY_URL_REGEX.test(href)) {
      //console.warn("Not adding button for", buttonContainer);
      throw Error("forced quit");
      return;
    }
    else {
      //console.warn("adding button for", buttonContainer);
      shareButton = createButtonElement();
      shareButton.classList.add("spreadButton")
      buttonsAdded.push(shareButton);
      buttonContainer.appendChild(shareButton);
    }
  } catch (err) {
    console.error(err);
  }
}




function addButtons() {
  let listOfButtonsOfPosts = document.getElementsByClassName(postButtonContainerClass);
  let numberOfPosts = listOfButtonsOfPosts.length;
  for (i = 0; i < numberOfPosts; i++) {
    let buttonContainer = listOfButtonsOfPosts[i];
    //console.warn("call from addButtons");
    appendButtonToContainer(buttonContainer);
  }
};
function removeButtons() {
  while (buttonsAdded.length > 0) {
    let buttn = buttonsAdded.shift();
    buttn.closest(".__processed").classList.remove("__processed");
    buttn.remove();
  }
};


function addSendApiListener() {
  if (targetNode) {
    targetNode.addEventListener("click", event => {
      let clickedElement = event.target;
      // console.warn(event.target.parentNode.parentNode.parentNode);
      if (clickedElement.closest('.spreadButton')) {
        //console.warn(clickedElement);
        let postContainer = clickedElement;
        while (!postContainer.classList.contains("relative") && !postContainer.classList.contains("ember-view")) {
          postContainer = postContainer.parentNode;

        }
        //console.warn(postContainer);
        sendSaveRequestToApi(postContainer);

      }
    });
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sendSaveRequestToApi(postContainer) {
  let _postUrl = '';
  //console.warn(postContainer);
  postContainer.querySelector(".feed-shared-control-menu__trigger").click();
  let shareButton = postContainer.querySelectorAll(".artdeco-dropdown__content-inner li>div")[1];
  while (shareButton === null || typeof shareButton === "undefined") {
    //console.warn(shareButton);
    await sleep(200);
    shareButton = postContainer.querySelectorAll(".artdeco-dropdown__content-inner li>div")[1];
  }
  let content = postContainer.getElementsByClassName("feed-shared-text relative feed-shared-update-v2__commentary  ember-view")[0];
  let contentClone = content.cloneNode(true);
  contentClone.querySelectorAll("a").forEach(anchor => {
    let anc = document.createElement("a");
    anc.href = anchor.href;
    anc.textContent = anchor.textContent;
    anchor.textContent = anc.outerHTML;
  });
  shareButton.click();
  _postUrl = await navigator.clipboard.readText();
  let postUrl = postContainer.getAttribute("data-urn");
  let thirdPartyPostId = postUrl.substring("urn:li:activity:".length);
  let userName = postContainer.getElementsByClassName("feed-shared-actor__name t-14 t-bold hoverable-link-text t-black")[0].textContent.trim();
  let userHeadline = postContainer.getElementsByClassName("feed-shared-actor__description t-12 t-normal t-black--light")[0].textContent.trim();
  //let postContent = contentClone.textContent.trim();
  let postContent = content.innerHTML.replace(/<br>/g, "\n").replace(/(<([^>]+)>)/gi, "").trim()
  let hashtags = content.innerHTML.match(/#[A-Za-z]+/g);
  let userProfileHref = postContainer.getElementsByClassName("app-aware-link feed-shared-actor__container-link relative display-flex flex-grow-1")[0].getAttribute("href");
  let userVanityUrl = userProfileHref.substring(linkedInProfileStartUrl.length, userProfileHref.indexOf(linkedInProfileEndUrl));
  let relativeTimeElement = postContainer.getElementsByClassName("feed-shared-actor__sub-description t-12 t-normal t-black--light")[0].textContent.trim();
  let relativeTime = relativeTimeElement.substring(0, relativeTimeElement.indexOf(" "));
  let postedAt = new Date();
  if (relativeTime.includes("mo")) {
    postedAt.setMonth(postedAt.getMonth() - relativeTime.replace(/[A-Za-z$-]/g, ""));
  } else if (relativeTime.includes("m")) {
    postedAt.setMinutes(postedAt.getMinutes() - relativeTime.replace(/[A-Za-z$-]/g, ""));

  } else if (relativeTime.includes("d")) {
    postedAt.setDate(postedAt.getDate() - relativeTime.replace(/[A-Za-z$-]/g, ""));

  } else if (relativeTime.includes("y")) {
    postedAt.setFullYear(postedAt.getFullYear() - relativeTime.replace(/[A-Za-z$-]/g, ""));
  } else if (relativeTime.includes("h")) {
    postedAt.setHours(postedAt.getHours() - relativeTime.replace(/[A-Za-z$-]/g, ""));
  } else if (relativeTime.includes("w")) {
    postedAt.setDate(postedAt.getDate() - relativeTime.replace(/[A-Za-z$-]/g, "") * 7);
  }

  let postID = _postUrl.match(POST_ID_REGEX);
  if (postID) postID = postID[0];

  let request = {
    //"postUrl": postUrl,
    "thirdPartyPostId": postID,
    "userName": userName,
    "postUrl": _postUrl,
    "userHeadline": userHeadline,
    "postContent": postContent,
    "hashtags": hashtags,
    "userProfileHref": userProfileHref,
    "userVanityUrl": userVanityUrl,
    "postedAt": postedAt
  }
  if (COMPANY_URL_REGEX.test(request.userProfileHref)) return;
  if (hashtags && hashtags.length) {
    hashtags = [...new Set(hashtags)];
  }
  console.warn(request);
  //return;
  chrome.runtime.sendMessage(request, function (status) {
    if (status == 200)
      alert("Shared. Always ask permission of post owner before sharing");
    else
      alert("Sync API Failed! Please try again")
  });
}



addSendApiListener();

window.onerror = function (message, file, line, col, error) {
  alert("Error occurred: " + error.message);
  return false;
};


// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11

  for (const mutation of mutationsList) {
    if (mutation.target.classList.contains("voyager-feed")) {
      addSendApiListener();
    }
    if (mutation.type === 'childList') {
      if (mutation.target.classList.contains('feed-shared-social-actions') && mutation.target.children.length == 4) {
        if (user.isLoggedIn && popupState.spread) {
          //console.warn("call from callback");
          appendButtonToContainer(mutation.target)
        };
      }
    }
  }
};



// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

document.addEventListener("visibilitychange", (ev) => {
  //console.warn("Visibility", ev, document.visibilityState);
  if (document.visibilityState === "visible") {
    chrome.runtime.sendMessage("try");
  }
});
chrome.extension.sendMessage("try");