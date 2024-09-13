// Create a Set to store unique video titles
let videoSet = new Set();
let processed_set = new Set();


// Function to save the current videoSet to browser local storage
function saveVideoSet() {
  chrome.storage.local.set({ videoSet: Array.from(videoSet) }, function() {
    //console.log('videoSet has been saved to storage');
  });
}

// Function to load the videoSet from storage when the content script runs
function loadVideoSet() {
  chrome.storage.local.get('videoSet', function(result) {
    if (result.videoSet) {
      videoSet = new Set(result.videoSet);
      //console.log('videoSet has been loaded from storage', videoSet);
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "clearVideoSet") {
    videoSet.clear();  // Clear the videoSet in memory
    processed_set.clear();  // Reset the processed set as well
    //console.log('videoSet has been cleared!');
	alert('YouTube Repeat Recommendation Remover: Cleared Storage'); // Show the alert
  }
});

// Function to scrape video information from the YouTube front page
function logYouTubeVideos() {
  let videos = document.querySelectorAll('ytd-rich-item-renderer');
  
  videos.forEach((video) => {
    let titleElement = video.querySelector('#video-title');
    let title = titleElement ? titleElement.textContent.trim() : 'No title found';
	    
    // Only add to the Set if the title is valid and not already present
    if (title !== 'No title found') {
		
	  if(!processed_set.has(title)){
		if(videoSet.has(title))
		{
		  console.log(`Removed: ${title}`); 
		  video.remove(); // Remove the video from the page
		}
		else{
          videoSet.add(title);
		  processed_set.add(title);
		  //console.log(`New Video Found: ${title}`);
		  saveVideoSet();  // Save updated videoSet to storage
		}
	  }
    }
  });
}

// Load the videoSet from storage before starting the logging process
loadVideoSet();

// Run the function to log video details every second (1000ms)
setInterval(logYouTubeVideos, 1000);