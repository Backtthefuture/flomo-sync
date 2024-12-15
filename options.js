// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  // 加载存储的设置
  chrome.storage.sync.get(['webhookUrl', 'defaultTag', 'christmasTheme'], (items) => {
    document.getElementById('webhook-url').value = items.webhookUrl || '';
    document.getElementById('default-tag').value = items.defaultTag || '';
    // 如果 christmasTheme 未设置，默认为 true
    document.getElementById('christmas-theme').checked = items.christmasTheme !== false;
  });

  // 获取当前快捷键设置
  chrome.commands.getAll((commands) => {
    const sidebarCommand = commands.find(command => command.name === '_execute_action');
    if (sidebarCommand && sidebarCommand.shortcut) {
      document.getElementById('current-shortcut').textContent = sidebarCommand.shortcut;
    }
  });

  // 绑定快捷键设置按钮事件
  document.getElementById('change-shortcut').addEventListener('click', () => {
    showStatus('请在浏览器地址栏输入：chrome://extensions/shortcuts 来修改快捷键', true);
  });

  // 绑定主题开关事件
  document.getElementById('christmas-theme').addEventListener('change', (e) => {
    chrome.storage.sync.set({
      christmasTheme: e.target.checked
    }, () => {
      showStatus(e.target.checked ? '圣诞主题已开启 🎄' : '圣诞主题已关闭', true);
    });
  });
});

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const webhookUrl = document.getElementById('webhook-url').value.trim();
  const defaultTag = document.getElementById('default-tag').value.trim();
  const christmasTheme = document.getElementById('christmas-theme').checked;
  
  if (!webhookUrl) {
    showStatus('请输入 Webhook URL', false);
    return;
  }
  
  chrome.storage.sync.set({
    webhookUrl: webhookUrl,
    defaultTag: defaultTag,
    christmasTheme: christmasTheme
  }, () => {
    showStatus('设置已保存！', true);
  });
});

function showStatus(message, success) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + (success ? 'success' : 'error');
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 5000);
}
