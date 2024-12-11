// Listen for keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-sidebar') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            chrome.runtime.sendMessage({ action: 'toggle-sidebar' });
          }
        });
      }
    } catch (error) {
      console.error('Error executing script:', error);
    }
  }
});

// Listen for extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
  } catch (error) {
    // If content script is not ready, inject it
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      // Try sending message again after injection
      await chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
    } catch (err) {
      console.error('Error:', err);
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'open-settings') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
  if (request.action === 'toggle-sidebar') {
    chrome.tabs.sendMessage(sender.tab.id, { action: 'toggle-sidebar' });
  }
});
