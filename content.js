const postButtonContainerClass = "feed-shared-social-actions feed-shared-social-action-bar social-detail-base-social-actions feed-shared-social-action-bar--has-social-counts";

const buttonMarkup = `<button class="message-anywhere-button send-privately-button artdeco-button artdeco-button--4 artdeco-button--tertiary  artdeco-button--muted " aria-label="Spread a message" type="button">
<li-icon aria-hidden="true" type="send-privately-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
<path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
</svg></li-icon>
<span class="artdeco-button__text">Spread</span>
</button>`

let linkedInProfileStartUrl = "https://www.linkedin.com/in/";
let linkedInProfileEndUrl = "?miniProfileUrn";



// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName("body")[0];

function createButtonElement() {
  const container = document.createElement('div');
  container.innerHTML = buttonMarkup;
  return container;
}

function appendButtonToContainer(buttonContainer) {
  shareButton = createButtonElement();
  shareButton.classList.add("spreadButton")
  buttonContainer.appendChild(shareButton);
}




(function addButtons() {
  let listOfButtonsOfPosts = document.getElementsByClassName(postButtonContainerClass);
  let numberOfPosts = listOfButtonsOfPosts.length;
  for (i = 0; i < numberOfPosts; i++) {
    let buttonContainer = listOfButtonsOfPosts[i];
    appendButtonToContainer(buttonContainer);
  }
})();


function addSendApiListener(){
if (targetNode) {
  targetNode.addEventListener("click", event => {
      let clickedElement = event.target;
      // console.log(event.target.parentNode.parentNode.parentNode);
      if (clickedElement.closest('.spreadButton')) {
        console.log(clickedElement);
        let postContainer = clickedElement;
        while (!postContainer.classList.contains("relative") && !postContainer.classList.contains("ember-view")) {
          postContainer = postContainer.parentNode;

        }
        console.log(postContainer);
        sendSaveRequestToApi(postContainer);

      }
    });
}
}
function sendSaveRequestToApi(postContainer) {
  let postUrl = postContainer.getAttribute("data-urn");
  let thirdPartyPostId = postUrl.substring("urn:li:activity:".length);
  let userName = postContainer.getElementsByClassName("feed-shared-actor__name t-14 t-bold hoverable-link-text t-black")[0].textContent.trim();
  let userHeadline = postContainer.getElementsByClassName("feed-shared-actor__description t-12 t-normal t-black--light")[0].textContent.trim();
  let postContent = postContainer.getElementsByClassName("feed-shared-text relative feed-shared-update-v2__commentary  ember-view")[0].innerHTML.replace(/<br>/g, "\n").replace(/(<([^>]+)>)/gi, "").trim()
  let hashtags = postContainer.getElementsByClassName("feed-shared-text relative feed-shared-update-v2__commentary  ember-view")[0].innerHTML.match(/#[A-Za-z]+/g);
  let userProfileHref = postContainer.getElementsByClassName("app-aware-link feed-shared-actor__container-link relative display-flex flex-grow-1")[0].getAttribute("href");
  let userVanityUrl = userProfileHref.substring(linkedInProfileStartUrl.length, userProfileHref.indexOf(linkedInProfileEndUrl));
  let relativeTimeElement = postContainer.getElementsByClassName("feed-shared-actor__sub-description t-12 t-normal t-black--light")[0].textContent.trim();
  let relativeTime = relativeTimeElement.substring(0, relativeTimeElement.indexOf(" "));
  let postedAt = new Date();
  if(relativeTime.includes("mo")){
      postedAt.setMonth(postedAt.getMonth()-relativeTime.replace(/[A-Za-z$-]/g, ""));
  } else if(relativeTime.includes("m")){
    postedAt.setMinutes(postedAt.getMinutes()-relativeTime.replace(/[A-Za-z$-]/g, ""));

  }else if (relativeTime.includes("d")){
    postedAt.setDate(postedAt.getDate()-relativeTime.replace(/[A-Za-z$-]/g, ""));

  }else if(relativeTime.includes("y")){
    postedAt.setFullYear(postedAt.getFullYear()-relativeTime.replace(/[A-Za-z$-]/g, ""));
  }else if(relativeTime.includes("h")){
    postedAt.setHours(postedAt.getHours()-relativeTime.replace(/[A-Za-z$-]/g, ""));
  }else if(relativeTime.includes("w")){
    postedAt.setDate(postedAt.getDate()-relativeTime.replace(/[A-Za-z$-]/g, "")*7);
  }

  let request = {
    "postUrl": postUrl,
    "thirdPartyPostId": thirdPartyPostId,
    "userName": userName,
    "userHeadline": userHeadline,
    "postContent": postContent,
    "hashtags": hashtags,
    "userProfileHref": userProfileHref,
    "userVanityUrl": userVanityUrl,
    "postedAt": postedAt
  }
  console.log(request);

  chrome.runtime.sendMessage(request,function(status) {
    if(status == 200)
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
    if(mutation.target.classList.contains("voyager-feed")){
      addSendApiListener();
    }
    if (mutation.type === 'childList') {
      if (mutation.target.classList.contains('feed-shared-social-actions') && mutation.target.children.length == 4) {
        appendButtonToContainer(mutation.target);

      }
    }

  }
};



// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);