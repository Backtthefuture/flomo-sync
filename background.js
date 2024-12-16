// 扩展安装或更新时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    // 确保快捷键设置正确初始化
    chrome.commands.getAll((commands) => {
      const sidebarCommand = commands.find(cmd => cmd.name === 'toggle-sidebar');
      if (sidebarCommand) {
        // 存储当前的快捷键设置
        chrome.storage.sync.set({
          sidebarShortcut: sidebarCommand.shortcut || 'Alt+F'
        });
      }
    });
  }
});

// 监听快捷键命令
chrome.commands.onCommand.addListener(async (command) => {
  // 处理所有触发侧边栏的命令
  if (command === 'toggle-sidebar' || command === '_execute_action') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        // 尝试直接发送消息
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
        } catch (error) {
          // 如果content script未准备好，注入它
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          // 重试发送消息
          await chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
        }
      }
    } catch (error) {
      console.error('Error handling command:', error);
    }
  }
});

// 监听扩展图标点击
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
  } catch (error) {
    // 如果content script未准备好，注入它
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      // 重试发送消息
      await chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
    } catch (err) {
      console.error('Error injecting content script:', err);
    }
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 处理打开设置页面的请求
  if (message.action === 'open-settings') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
    return;
  }
  
  // 处理侧边栏切换的请求
  if (message.action === 'toggle-sidebar' && sender.tab) {
    chrome.tabs.sendMessage(sender.tab.id, { action: 'toggle-sidebar' });
  }
});
