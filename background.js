// Listen for the browser action (toolbar button) click
chrome.browserAction.onClicked.addListener(function(tab) {
  // Clear the saved videoSet from local storage
  chrome.storage.local.remove('videoSet', function() {
    console.log('videoSet has been cleared');
    // Notify the user that the videoSet has been cleared
    chrome.tabs.sendMessage(tab.id, { action: "clearVideoSet" });
  });
});