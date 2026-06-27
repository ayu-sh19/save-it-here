chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-second-brain",
    title: "Save to Second Brain",
    contexts: ["selection", "link", "page"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "save-to-second-brain") {
    let url = info.linkUrl || info.pageUrl;
    let text = info.selectionText || "";

    console.log("Context menu clicked. URL:", url, "Text:", text);

    chrome.storage.local.set({ 
      quickAddUrl: url,
      quickAddText: text 
    }, () => {
      console.log("Saved context to local storage");
    });
  }
});
