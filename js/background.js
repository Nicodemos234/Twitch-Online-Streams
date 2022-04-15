// chrome.runtime.onInstalled.addListener(() => {
//   // default state goes here
//   // this runs ONE TIME ONLY (unless the user reinstalls your extension)
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["js/3rd/jquery-3.6.0.min.js", "./js/foreground.js"]
      })
          .then(() => {
              console.log("INJECTED THE FOREGROUND SCRIPT.");
          })
          .catch(err => console.log(err));
  }
});