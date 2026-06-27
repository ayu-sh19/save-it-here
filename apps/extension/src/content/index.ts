console.log("Save-It-Here Content Script loaded");

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request: any, _sender: any, sendResponse: any) => {
  if (request.type === "EXTRACT_PAGE_DATA") {
    const pageData = {
      title: document.title,
      url: window.location.href,
      selection: window.getSelection()?.toString() || "",
      // Instagram/Twitter specific scraping logic could go here
    };
    sendResponse(pageData);
  }
  return true; // Keep message channel open for async
});
