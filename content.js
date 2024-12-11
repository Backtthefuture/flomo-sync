let sidebar = null;
let isOpen = false;

// 确保 DOM 加载完成后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

function initializeExtension() {
  // 监听来自 background script 的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle-sidebar') {
      toggleSidebar();
      sendResponse({ success: true });
    }
    // 不返回 true，因为我们已经同步处理了消息
  });
}

function createSidebar() {
  sidebar = document.createElement('div');
  sidebar.id = 'flomo-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>Flomo Sync</h2>
      <button id="flomo-settings" title="Settings">⚙️</button>
      <button id="flomo-close">×</button>
    </div>
    <div class="sidebar-content">
      <div class="input-group">
        <label>标题和链接</label>
        <input type="text" id="flomo-title" readonly>
        <input type="text" id="flomo-url" readonly>
      </div>
      <div class="input-group">
        <label>原文摘要</label>
        <textarea id="flomo-summary" placeholder="粘贴原文摘要..."></textarea>
      </div>
      <div class="input-group">
        <label>个人感想</label>
        <textarea id="flomo-thoughts" placeholder="输入你的想法..."></textarea>
      </div>
      <button id="flomo-submit">提交到 Flomo</button>
    </div>
  `;
  document.body.appendChild(sidebar);
  
  // Add event listeners
  document.getElementById('flomo-close').addEventListener('click', toggleSidebar);
  document.getElementById('flomo-settings').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'open-settings' });
  });
  document.getElementById('flomo-submit').addEventListener('click', submitToFlomo);
  
  // Auto-fill current page info
  document.getElementById('flomo-title').value = document.title;
  document.getElementById('flomo-url').value = window.location.href;
}

function toggleSidebar() {
  if (!sidebar) {
    createSidebar();
  }
  
  isOpen = !isOpen;
  sidebar.style.right = isOpen ? '0' : '-400px';
}

async function submitToFlomo() {
  try {
    const title = document.getElementById('flomo-title').value;
    const url = document.getElementById('flomo-url').value;
    const summary = document.getElementById('flomo-summary').value;
    const thoughts = document.getElementById('flomo-thoughts').value;
    
    // Get settings
    const settings = await chrome.storage.sync.get(['webhookUrl', 'defaultTag']);
    const tag = settings.defaultTag || '#sstoflomo';
    
    if (!settings.webhookUrl) {
      alert('请先在设置中配置 Flomo Webhook URL');
      return;
    }
    
    const content = `[${title}](${url})\n\n原文摘要：\n\n${summary}\n\n个人感想：\n\n${thoughts}\n\n${tag}`;
    
    const response = await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ content }),
    });
    
    const responseText = await response.text();
    
    if (response.ok) {
      alert('成功同步到 Flomo！');
      // Clear input fields
      document.getElementById('flomo-summary').value = '';
      document.getElementById('flomo-thoughts').value = '';
    } else {
      throw new Error(`请求失败: ${responseText}`);
    }
  } catch (error) {
    alert('同步失败：' + error.message);
  }
}
