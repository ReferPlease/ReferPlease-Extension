let __HOSTNAME = window.location.hostname;

console.log(__HOSTNAME);

if (__HOSTNAME === "www.referplease.com") {
  __REFERPLEASE_start();
}
/*else if (__HOSTNAME === "localhost") {
  __REFERPLEASE_start(); // only for testing
}*/
else if (__HOSTNAME === "www.linkedin.com") {
  __LINKEDIN_start();
}