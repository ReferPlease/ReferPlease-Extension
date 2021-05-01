let __HOSTNAME = window.location.hostname;
//const __REFERPLEASE_HOSTNAMES = ["localhost", "www.referplease.com"];
const __REFERPLEASE_HOSTNAMES = ["www.referplease.com"];
console.log(__HOSTNAME);

if (__REFERPLEASE_HOSTNAMES.includes(__HOSTNAME)) {
  __REFERPLEASE_start();
}

//#region comment before publish
else if (__HOSTNAME === "localhost") {
  __REFERPLEASE_start(); // only for testing
}
//#endregion comment before publish

else if (__HOSTNAME === "www.linkedin.com") {
  __LINKEDIN_start();
}