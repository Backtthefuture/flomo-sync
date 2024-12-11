// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['webhookUrl', 'defaultTag'], (items) => {
    document.getElementById('webhook-url').value = items.webhookUrl || '';
    document.getElementById('default-tag').value = items.defaultTag || '#Chrome阅读笔记';
  });
});

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const webhookUrl = document.getElementById('webhook-url').value.trim();
  const defaultTag = document.getElementById('default-tag').value.trim();
  
  if (!webhookUrl) {
    showStatus('请输入 Webhook URL', false);
    return;
  }
  
  chrome.storage.sync.set({
    webhookUrl: webhookUrl,
    defaultTag: defaultTag || '#Chrome阅读笔记'
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
  }, 3000);
}
