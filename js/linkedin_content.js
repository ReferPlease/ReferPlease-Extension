const postButtonContainerClass =
  "feed-shared-social-actions feed-shared-social-action-bar social-detail-base-social-actions feed-shared-social-action-bar--has-social-counts";
const POST_ID_REGEX = /(\d{19})/gm;
const COMPANY_URL_REGEX = /(company)|(miniCompany)/gim;
let user = {
  isLoggedIn: false,
};
let popupState = {
  spread: true,
};
let buttonsAdded = [];

const buttonMarkup = `
<style>
.refer_please__spread_button svg {
  height: 24px;
  width: 24px;
  margin-right: 4px;
}
</style>
<button class="refer_please__spread_button message-anywhere-button send-privately-button artdeco-button artdeco-button--4 artdeco-button--tertiary  artdeco-button--muted " aria-label="Spread a message" type="button">
<li-icon aria-hidden="true" type="send-privately-icon">
<svg width="24" height="24" viewBox="0 0 438 328" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M372.638 11.403C357.538 18.103 353.638 20.203 353.838 21.603C354.138 24.503 359.138 35.103 360.038 34.703C360.438 34.503 369.438 30.603 380.038 26.003C401.438 16.703 399.938 18.303 395.538 8.30303C394.238 5.30303 392.838 2.90303 392.438 3.00303C391.938 3.00303 383.138 6.80303 372.638 11.403Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M275.238 11.403C265.238 14.503 255.938 23.503 249.238 36.403C232.738 68.603 232.138 124.903 247.838 173.403C249.238 177.803 250.538 181.503 250.638 181.703C250.838 181.903 264.438 177.003 264.938 176.403C265.138 176.203 263.938 171.803 262.238 166.503C246.138 116.103 250.138 53.803 270.838 33.103C280.938 23.003 292.038 24.703 304.838 38.203C320.238 54.503 331.838 83.203 337.838 119.403C340.538 136.303 340.338 171.903 337.438 185.303C333.138 204.503 323.838 219.003 311.838 224.903C300.138 230.603 290.938 231.003 264.138 226.903C257.238 225.903 241.838 223.803 229.738 222.403L207.838 219.703L205.138 222.503C148.938 281.803 143.638 287.203 143.338 284.803C135.838 232.603 132.338 209.803 131.838 209.303C131.438 208.903 107.738 205.603 79.0376 202.003C50.3376 198.403 26.6376 194.903 26.4376 194.403C26.3376 193.803 24.8376 184.203 23.1376 172.903C20.8376 157.003 20.4376 152.203 21.4376 151.603C23.0376 150.503 193.538 75.103 193.838 75.403C194.038 75.503 185.838 94.803 175.638 118.403C165.438 142.003 157.138 161.703 157.138 162.303C157.238 163.403 201.038 196.903 202.338 196.903C202.738 196.903 205.138 194.103 207.738 190.803C212.238 184.903 212.438 184.603 210.538 183.203C209.538 182.403 201.338 176.303 192.538 169.603L176.438 157.403L179.838 149.403C181.738 145.003 190.538 124.403 199.338 103.603L215.338 65.903L214.138 57.403L212.938 49.003L207.838 51.303C204.938 52.503 157.838 73.303 103.138 97.403C48.4376 121.503 3.33758 141.503 3.03758 141.803C2.33758 142.403 11.6376 208.703 12.4376 209.603C12.7376 209.903 36.7376 213.103 65.8376 216.803L118.638 223.403L125.638 272.803L132.638 322.203L173.138 279.803C195.338 256.503 213.638 237.303 213.738 237.103C213.938 236.703 240.338 240.003 265.138 243.503C294.238 247.603 307.738 246.203 322.738 237.403C334.338 230.603 344.538 216.703 350.038 200.303C354.938 185.503 356.438 171.803 355.838 146.903C355.238 123.403 353.438 110.303 348.038 89.903C333.638 35.803 302.938 2.80298 275.238 11.403Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M394.138 57.503C382.938 61.003 373.538 64.203 373.338 64.403C372.638 65.103 377.838 79.403 378.738 79.303C381.638 78.803 419.838 66.503 420.538 65.803C421.838 64.603 417.738 51.503 416.038 51.203C415.238 51.103 405.438 53.903 394.138 57.503Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M407.638 105.603C395.538 107.503 385.538 109.103 385.438 109.203C384.738 110.003 387.638 124.903 388.538 124.903C391.238 125.003 431.738 118.603 432.238 118.003C433.038 117.303 431.238 103.703 430.238 102.803C429.938 102.503 419.738 103.703 407.638 105.603Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M389.138 165.903V173.903H412.138H435.138V165.903V157.903H412.138H389.138V165.903Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M385.038 207.003C385.038 207.803 384.738 211.403 384.238 215.103C383.838 218.903 383.538 221.903 383.538 222.003C383.738 222.103 426.638 226.603 426.838 226.503C426.938 226.403 427.338 222.703 427.738 218.303L428.438 210.303L410.538 208.503C400.638 207.603 390.938 206.503 388.938 206.203C386.138 205.803 385.138 206.003 385.038 207.003Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M17.7376 234.703C18.0376 238.903 19.3376 254.503 20.5376 269.403L22.6376 296.403L30.5376 296.203C34.9376 296.003 38.5376 295.803 38.6376 295.703C39.0376 295.103 33.6376 229.003 33.1376 228.603C32.8376 228.403 29.1376 227.903 24.8376 227.603L17.1376 226.903L17.7376 234.703Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
<path d="M269.138 263.803C269.138 264.903 276.338 311.403 276.538 311.603C276.838 312.003 291.138 309.203 291.538 308.803C292.138 308.103 285.638 267.103 284.838 266.303C283.938 265.303 269.138 263.003 269.138 263.803Z" fill="#5E5E5E" stroke="#5E5E5E" stroke-width="5"/>
</svg>

</li-icon>
<span class="artdeco-button__text">Spread</span>
</button>`;

let linkedInProfileStartUrl = "https://www.linkedin.com/in/";
let linkedInProfileEndUrl = "?miniProfileUrn";

// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName("body")[0];

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

function createButtonElement() {
  const container = document.createElement("div");
  container.innerHTML = buttonMarkup;
  return container;
}

function appendButtonToContainer(buttonContainer) {
  if (buttonContainer.classList.contains("__processed")) return;
  buttonContainer.classList.add("__processed");
  try {
    let ember = buttonContainer.closest("div[data-urn]");
    let hrefEl = ember.querySelector("a.app-aware-link");
    let href = hrefEl.href;
    //console.warn(href);
    if (COMPANY_URL_REGEX.test(href)) {
      //console.warn("Not adding button for", buttonContainer);
      throw Error("forced quit");
    } else {
      //console.warn("adding button for", buttonContainer);
      shareButton = createButtonElement();
      shareButton.classList.add("spreadButton");
      buttonsAdded.push(shareButton);
      buttonContainer.appendChild(shareButton);
    }
  } catch (err) {
    console.error(err);
  }
}

function addButtons() {
  let listOfButtonsOfPosts = document.getElementsByClassName(
    postButtonContainerClass
  );
  let numberOfPosts = listOfButtonsOfPosts.length;
  for (i = 0; i < numberOfPosts; i++) {
    let buttonContainer = listOfButtonsOfPosts[i];
    //console.warn("call from addButtons");
    appendButtonToContainer(buttonContainer);
  }
}
function removeButtons() {
  while (buttonsAdded.length > 0) {
    let buttn = buttonsAdded.shift();
    buttn.closest(".__processed").classList.remove("__processed");
    buttn.remove();
  }
}

function addSendApiListener() {
  if (targetNode) {
    targetNode.addEventListener("click", (event) => {
      let clickedElement = event.target;
      // console.warn(event.target.parentNode.parentNode.parentNode);
      if (clickedElement.closest(".spreadButton")) {
        //console.warn(clickedElement);
        let postContainer = clickedElement;
        while (
          !postContainer.classList.contains("relative") &&
          !postContainer.classList.contains("ember-view")
        ) {
          postContainer = postContainer.parentNode;
        }
        //console.warn(postContainer);
        sendSaveRequestToApi(postContainer);
      }
    });
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sendSaveRequestToApi(postContainer) {
  let _postUrl = "";
  let HASHTAG_ACTIVITY_ID = /hashtag\/\?.*activity%3A(\d+)"/gm;
  //console.warn(postContainer);
  let __str = postContainer.outerHTML;
  let ___POST_ID = null;
  let __matches = HASHTAG_ACTIVITY_ID.exec(__str);
  if (__matches) {
    //console.warn("Matched", __matches, __str);
    ___POST_ID = __matches[1];
    _postUrl = `https://www.linkedin.com/feed/update/urn:li:activity:${___POST_ID}/`;
  } else {
    //console.warn("Not Matched", __matches, __str);
    while (true) {
      try {
        let cancelButton = document.getElementsByClassName(
          `artdeco-toast-item__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view`
        )[0];
        cancelButton.click();
        await sleep(300);
      } catch (err) {
        break;
      }
    }
    postContainer.querySelector(".feed-shared-control-menu__trigger").click();
    let shareButton = postContainer.querySelectorAll(
      ".artdeco-dropdown__content-inner li>div"
    )[1];
    while (shareButton === null || typeof shareButton === "undefined") {
      //console.warn(shareButton);
      await sleep(200);
      shareButton = postContainer.querySelectorAll(
        ".artdeco-dropdown__content-inner li>div"
      )[1];
    }
    shareButton.click();
    _postUrl = document.getElementsByClassName("artdeco-toast-item__cta")[0]; //await navigator.clipboard.readText();
    if (!_postUrl) {
      alert("Some Error occured reading post url");
      return;
    }
    _postUrl = _postUrl.href;
  }
  let content = postContainer.getElementsByClassName(
    "feed-shared-text relative feed-shared-update-v2__commentary  ember-view"
  )[0];
  let contentClone = content.cloneNode(true);
  contentClone.querySelectorAll("a").forEach((anchor) => {
    let anc = document.createElement("a");
    anc.href = anchor.href;
    anc.textContent = anchor.textContent;
    anchor.textContent = anc.outerHTML;
  });
  let postUrl = postContainer.getAttribute("data-urn");
  let thirdPartyPostId = postUrl.substring("urn:li:activity:".length);
  let userName = postContainer
    .getElementsByClassName(
      "feed-shared-actor__name t-14 t-bold hoverable-link-text t-black"
    )[0]
    .textContent.trim();
  let userHeadline = postContainer
    .getElementsByClassName(
      "feed-shared-actor__description t-12 t-normal t-black--light"
    )[0]
    .textContent.trim();
  //let postContent = contentClone.textContent.trim();
  let postContent = content.innerHTML
    .replace(/<br>/g, "\n")
    .replace(/(<([^>]+)>)/gi, "")
    .trim();
  let hashtags = content.innerHTML.match(/#[A-Za-z]+/g);
  let userProfileHref = postContainer
    .getElementsByClassName(
      "app-aware-link feed-shared-actor__container-link relative display-flex flex-grow-1"
    )[0]
    .getAttribute("href");
  let userVanityUrl = userProfileHref.substring(
    linkedInProfileStartUrl.length,
    userProfileHref.indexOf(linkedInProfileEndUrl)
  );
  let relativeTimeElement = postContainer
    .getElementsByClassName(
      "feed-shared-actor__sub-description t-12 t-normal t-black--light"
    )[0]
    .textContent.trim();
  let relativeTime = relativeTimeElement.substring(
    0,
    relativeTimeElement.indexOf(" ")
  );
  let postedAt = new Date();
  if (relativeTime.includes("mo")) {
    postedAt.setMonth(
      postedAt.getMonth() - relativeTime.replace(/[A-Za-z$-]/g, "")
    );
  } else if (relativeTime.includes("m")) {
    postedAt.setMinutes(
      postedAt.getMinutes() - relativeTime.replace(/[A-Za-z$-]/g, "")
    );
  } else if (relativeTime.includes("d")) {
    postedAt.setDate(
      postedAt.getDate() - relativeTime.replace(/[A-Za-z$-]/g, "")
    );
  } else if (relativeTime.includes("y")) {
    postedAt.setFullYear(
      postedAt.getFullYear() - relativeTime.replace(/[A-Za-z$-]/g, "")
    );
  } else if (relativeTime.includes("h")) {
    postedAt.setHours(
      postedAt.getHours() - relativeTime.replace(/[A-Za-z$-]/g, "")
    );
  } else if (relativeTime.includes("w")) {
    postedAt.setDate(
      postedAt.getDate() - relativeTime.replace(/[A-Za-z$-]/g, "") * 7
    );
  }

  let postID = _postUrl.match(POST_ID_REGEX);
  if (postID) postID = postID[0];

  let request = {
    //"postUrl": postUrl,
    thirdPartyPostId: postID,
    userName: userName,
    postUrl: _postUrl,
    userHeadline: userHeadline,
    postContent: postContent,
    hashtags: hashtags,
    userProfileHref: userProfileHref,
    userVanityUrl: userVanityUrl,
    postedAt: postedAt,
  };
  //console.warn(request.postedAt);
  let currentDate = new Date();
  let time_diff = currentDate.getTime() - request.postedAt.getTime();
  time_diff = time_diff / (1000 * 60 * 60 * 24);
  //console.warn(time_diff);
  if (time_diff > 2.0) {
    alert("Sorry, post does not looks fresh.");
    return;
  }
  if (COMPANY_URL_REGEX.test(request.userProfileHref)) return;
  if (hashtags && hashtags.length) {
    hashtags = hashtags.map((tag) => tag.toLowerCase());
    hashtags = [...new Set(hashtags)];
  }
  //console.warn(request);
  //return;
  chrome.runtime.sendMessage(request, (status) => {
    console.log(status);
    if (status === 200) alert("Shared. Together we are stronger.");
    else if (status === 400) alert("Already Present. Thanks for trying");
    else alert("Sync API Failed! Please try again");
  });
}

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11

  for (const mutation of mutationsList) {
    if (mutation.target.classList.contains("voyager-feed")) {
      addSendApiListener();
    }
    if (mutation.type === "childList") {
      if (
        mutation.target.classList.contains("feed-shared-social-actions") &&
        mutation.target.children.length == 4
      ) {
        if (user.isLoggedIn && popupState.spread) {
          //console.warn("call from callback");
          console.warn("appending to",mutation.target);
          appendButtonToContainer(mutation.target);
        }
      }
    }
  }
};

function __LINKEDIN_start() {
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

  addSendApiListener();

  window.onerror = function (message, file, line, col, error) {
    alert("Error occurred: " + error.message);
    return false;
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  document.addEventListener("visibilitychange", (ev) => {
    // console.warn("Visibility", ev, document.visibilityState);
    if (document.visibilityState === "visible") {
      chrome.runtime.sendMessage("try");
    }
  });
  chrome.runtime.sendMessage("try");
}
