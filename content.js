chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.action == "get_access_token") {
    let message = {
      action: "get_access_token",
      data: localStorage["ACCESS_TOKEN"]
    }
    sendResponse(message);
  }
});