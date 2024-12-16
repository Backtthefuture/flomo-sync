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

  // 监听主题设置变化
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.christmasTheme && sidebar) {
      updateTheme(changes.christmasTheme.newValue);
    }
  });
}

// 更新主题
function updateTheme(isChristmas) {
  if (sidebar) {
    if (isChristmas !== false) {
      sidebar.classList.add('christmas-theme');
    } else {
      sidebar.classList.remove('christmas-theme');
    }
  }
}

function createSidebar() {
  sidebar = document.createElement('div');
  sidebar.id = 'flomo-sidebar';
  
  // 检查并应用主题设置，默认开启圣诞主题
  chrome.storage.sync.get(['christmasTheme'], (items) => {
    if (items.christmasTheme !== false) {
      sidebar.classList.add('christmas-theme');
    }
  });

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="header-title">
        <h2>善思flomo</h2>
        <span class="header-subtitle">更多思考更多智慧</span>
      </div>
      <div class="header-actions">
        <button id="flomo-settings" title="设置" class="icon-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15ZM19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.87653 6.85425 4.02405 7.04 4.21L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 20.91 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button id="flomo-close" title="关闭" class="icon-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="sidebar-content">
      <div class="input-group">
        <label>
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="currentColor"/>
          </svg>
          标题和链接
        </label>
        <div class="input-container">
          <input type="text" id="flomo-title" readonly>
          <input type="text" id="flomo-url" readonly>
        </div>
      </div>
      <div class="input-group">
        <div class="label-container">
          <label>
            <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V7H19V19ZM17 12H7V10H17V12ZM14 15H7V14H14V15Z" fill="currentColor"/>
            </svg>
            原文摘要
          </label>
          <button id="ai-summarize" class="action-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="currentColor"/>
            </svg>
            AI总结
          </button>
        </div>
        <div class="textarea-container">
          <textarea id="flomo-summary" placeholder="粘贴原文摘要..."></textarea>
          <div id="ai-loading" class="ai-loading hidden">
            <div class="spinner"></div>
            <span>AI正在分析...</span>
          </div>
        </div>
      </div>
      <div class="input-group">
        <label>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 2C9.5 2 9 4 10.5 5.5C12 7 14 7 14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3.5 8C3.5 8 5.5 9 7 10.5C8.5 12 8.5 14 8.5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3.5 16C3.5 16 5.5 15 7 13.5C8.5 12 8.5 10 8.5 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9.5 22C9.5 22 9 20 10.5 18.5C12 17 14 17 14 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M20.5 16C20.5 16 18.5 15 17 13.5C15.5 12 15.5 10 15.5 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M20.5 8C20.5 8 18.5 9 17 10.5C15.5 12 15.5 14 15.5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 9C13.1046 9 14 8.10457 14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9Z" fill="currentColor"/>
            <path d="M12 19C13.1046 19 14 18.1046 14 17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17C10 18.1046 10.8954 19 12 19Z" fill="currentColor"/>
            <path d="M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z" fill="currentColor"/>
            <path d="M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z" fill="currentColor"/>
          </svg>
          <span class="label-text">个人感想</span>
          <span id="thoughts-feedback" class="feedback-text"></span>
        </label>
        <textarea id="flomo-thoughts" placeholder="输入你的想法..."></textarea>
      </div>
      <button id="flomo-submit" class="submit-button">
        <span class="button-text">提交到 Flomo</span>
        <svg class="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13H16.17L11.29 17.88C10.9 18.27 10.9 18.91 11.29 19.3C11.68 19.69 12.31 19.69 12.7 19.3L19.29 12.71C19.68 12.32 19.68 11.69 19.29 11.3L12.71 4.7C12.32 4.31 11.69 4.31 11.3 4.7C10.91 5.09 10.91 5.72 11.3 6.11L16.17 11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(sidebar);
  
  // Add event listeners
  document.getElementById('flomo-close').addEventListener('click', toggleSidebar);
  document.getElementById('flomo-settings').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'open-settings' });
  });
  document.getElementById('flomo-submit').addEventListener('click', submitToFlomo);
  document.getElementById('flomo-thoughts').addEventListener('input', handleThoughtsInput);
  
  // 为原文摘要输入框添加自动调整高度的事件监听
  document.getElementById('flomo-summary').addEventListener('input', function(e) {
    requestAnimationFrame(() => {
      e.target.style.height = 'auto';
      const newHeight = Math.min(e.target.scrollHeight, 300);
      e.target.style.height = `${newHeight}px`;
    });
  });
  
  // Add AI summarize button listener
  const aiButton = document.getElementById('ai-summarize');
  console.log('AI按钮元素:', aiButton); // 调试日志
  if (aiButton) {
    aiButton.addEventListener('click', async () => {
      console.log('AI总结按钮被点击');
      const loadingEl = document.getElementById('ai-loading');
      const summaryEl = document.getElementById('flomo-summary');
      
      try {
        loadingEl.classList.remove('hidden');
        
        // Get selected text or full page content
        let text = window.getSelection().toString().trim();
        if (!text) {
          text = document.body.innerText;
        }
        console.log('获取到的文本:', text.substring(0, 100) + '...');
        
        // Truncate text if it's too long
        if (text.length > 4000) {
          text = text.substring(0, 4000) + '...';
        }
        
        console.log('开始调用API...');
        const summary = await summarizeWithAI(text);
        console.log('API返回结果:', summary);
        summaryEl.value = summary;
      } catch (error) {
        console.error('AI总结错误:', error);
        alert('AI总结失败，请重试。错误：' + error.message);
      } finally {
        loadingEl.classList.add('hidden');
      }
    });
    console.log('AI按钮事件监听器已添加');
  } else {
    console.error('找不到AI总结按钮元素！');
  }
  
  // Auto-fill current page info
  document.getElementById('flomo-title').value = document.title;
  document.getElementById('flomo-url').value = window.location.href;
  
  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    .icon-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .icon-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .ai-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      color: #666;
    }
    
    .ai-loading.hidden {
      display: none;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .label-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(to right, #f3f3f3, #ffffff);
      border: 1px solid #e6e6e6;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      color: #6b46c1;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(107, 70, 193, 0.1);
    }

    .action-button::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #6b46c1, #805ad5, #9f7aea);
      border-radius: 8px;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .action-button:hover {
      transform: translateY(-1px);
      background: #ffffff;
      border-color: transparent;
    }

    .action-button:hover::before {
      opacity: 1;
    }

    .action-button svg {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    .action-button:hover svg {
      transform: scale(1.1);
    }

    .action-button svg path {
      fill: #6b46c1;
    }

    .action-button:hover svg path {
      fill: #805ad5;
    }

    .textarea-container {
      position: relative;
    }

    .ai-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.95);
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(107, 70, 193, 0.15);
    }

    .ai-loading.hidden {
      display: none;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #e9d8fd;
      border-top: 2px solid #6b46c1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* 提交成功动效 */
    @keyframes confetti {
      0% { transform: translateY(0) rotateZ(0); opacity: 1; }
      100% { transform: translateY(-500%) rotateZ(720deg); opacity: 0; }
    }

    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }

    .confetti {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #6b46c1;
      opacity: 0;
    }

    .submit-success {
      position: relative;
      animation: success-pulse 0.5s ease;
    }

    @keyframes success-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styles);
}

function createConfetti() {
  const sidebar = document.getElementById('flomo-sidebar');
  const container = document.createElement('div');
  container.className = 'confetti-container';
  sidebar.appendChild(container);

  const colors = ['#6b46c1', '#805ad5', '#9f7aea', '#e9d8fd', '#faf5ff'];
  const shapes = ['square', 'circle'];

  // 减少粒子数量，适应侧边栏大小
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const left = Math.random() * 100;
    const top = 70 + Math.random() * 20; // 从提交按钮附近开始
    const delay = Math.random() * 2;
    const duration = 0.8 + Math.random() * 1.2;
    const rotation = Math.random() * 360;
    
    confetti.style.cssText = `
      left: ${left}%;
      top: ${top}%;
      background: ${color};
      border-radius: ${shape === 'circle' ? '50%' : '0'};
      transform: rotate(${rotation}deg);
      animation: confetti ${duration}s ease-out ${delay}s forwards;
    `;
    
    container.appendChild(confetti);
  }

  setTimeout(() => {
    container.remove();
  }, 4000);
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
    const submitButton = document.querySelector('.submit-button');
    const title = document.getElementById('flomo-title').value;
    const url = document.getElementById('flomo-url').value;
    const summary = document.getElementById('flomo-summary').value;
    const thoughts = document.getElementById('flomo-thoughts').value;
    const feedback = document.getElementById('thoughts-feedback');
    
    const settings = await chrome.storage.sync.get(['webhookUrl', 'defaultTag']);
    const tag = settings.defaultTag ? settings.defaultTag : '';
    
    if (!settings.webhookUrl) {
      alert('请先在设置中配置 Flomo Webhook URL');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = '提交中...';
    
    const response = await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: `[📖 ${title}](${url})${
          summary.trim() ? `\n\n------------------------------------------------------------\n\n📝 原文摘要：\n${summary}` : ''
        }${
          thoughts.trim() ? `\n\n------------------------------------------------------------\n\n💭 个人感想：\n${thoughts}` : ''
        }${
          tag ? `\n\n${tag}` : ''
        }`
      })
    });

    if (response.ok) {
      submitButton.textContent = '提交成功！';
      submitButton.classList.add('submit-success');
      createConfetti();
      
      // 重置所有相关状态
      setTimeout(() => {
        document.getElementById('flomo-summary').value = '';
        document.getElementById('flomo-thoughts').value = '';
        feedback.textContent = ''; // 清除反馈文本
        feedback.className = 'feedback-text'; // 重置反馈样式
        submitButton.disabled = false;
        submitButton.textContent = '提交到 Flomo';
        submitButton.classList.remove('submit-success');
        submitButton.className = 'submit-button'; // 重置按钮样式
      }, 2000);
    } else {
      submitButton.textContent = '提交失败';
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = '提交到 Flomo';
      }, 2000);
    }
  } catch (error) {
    console.error('提交失败:', error);
    const submitButton = document.querySelector('.submit-button');
    submitButton.textContent = '提交失败';
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = '提交到 Flomo';
    }, 2000);
  }
}

function handleThoughtsInput(e) {
  const thoughts = e.target.value;
  const charCount = thoughts.length;
  const submitBtn = document.getElementById('flomo-submit');
  const feedback = document.getElementById('thoughts-feedback');
  const thoughtsInput = document.getElementById('flomo-thoughts');
  
  // 自动调整高度
  requestAnimationFrame(() => {
    // 先将高度设为0，以获取实际内容高度
    thoughtsInput.style.height = 'auto';
    // 设置新高度，但不超过最大高度
    const newHeight = Math.min(thoughtsInput.scrollHeight, 200);
    thoughtsInput.style.height = `${newHeight}px`;
  });
  
  // 更新输入框样式
  thoughtsInput.classList.remove('level1', 'level2', 'level3', 'level4');
  if (charCount === 0) {
    thoughtsInput.classList.add('level1');
  } else if (charCount < 15) {
    thoughtsInput.classList.add('level1');
  } else if (charCount < 30) {
    thoughtsInput.classList.add('level2');
  } else if (charCount < 50) {
    thoughtsInput.classList.add('level3');
  } else {
    thoughtsInput.classList.add('level4');
  }
  
  // Handle button animation states
  if (charCount === 0) {
    submitBtn.className = 'submit-button'; 
  } else if (charCount < 50) {
    submitBtn.className = 'submit-button typing'; 
  } else {
    submitBtn.className = 'submit-button ready'; 
  }
  
  // Update feedback text with new thresholds
  if (charCount === 0) {
    feedback.textContent = '';
  } else if (charCount < 15) {
    feedback.textContent = '开始写下你的思考...';
    feedback.className = 'feedback-text level1';
  } else if (charCount < 30) {
    feedback.textContent = '很好，继续深入思考...';
    feedback.className = 'feedback-text level2';
  } else if (charCount < 50) {
    feedback.textContent = '不错，这个想法很有意思！';
    feedback.className = 'feedback-text level3';
  } else {
    feedback.textContent = '太棒了，你的思考很深入！';
    feedback.className = 'feedback-text level4';
  }
}

// Add GLM-4 API integration
const API_KEY = '3da54b4b6c74c07390875f6981df88dc.D9LxP7hOlMyDbXvG';

async function summarizeWithAI(text) {
  const endpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  
  try {
    console.log('准备发送请求到:', endpoint);
    const requestBody = {
      model: 'glm-4-flash',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的文章分析助手。请按照以下结构分析并总结文章：

1. 核心观点（1-2条）：提取文章最重要的核心论点或见解
2. 关键信息（2-3条）：列出支撑核心观点的重要数据、案例或论据
3. 独特见解（1条）：指出文章中最有价值或最具启发性的观点
4. 行动建议（如有）：如果文章包含实践指导，提供1-2条具体可行的建议

请用简洁的中文表达，每点控制在20字以内。如果是英文文章，请用中文总结。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1024
    };
    console.log('请求体:', requestBody);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API响应状态:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API响应数据:', data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('调用API时出错:', error);
    throw error;
  }
}

function showStatus(message, success = true) {
  const statusDiv = document.createElement('div');
  statusDiv.className = `flomo-status ${success ? 'success' : 'error'}`;
  
  // 检查是否启用了圣诞主题
  chrome.storage.sync.get(['christmasTheme'], (items) => {
    if (success && items.christmasTheme) {
      // 在成功消息前添加圣诞树图标，并修改文案
      statusDiv.textContent = `🎄 ${message} 圣诞快乐！`;
      statusDiv.classList.add('christmas-status');
    } else {
      statusDiv.textContent = message;
    }
  });

  document.body.appendChild(statusDiv);
  
  // 添加入场动画
  setTimeout(() => statusDiv.classList.add('show'), 10);
  
  // 3秒后移除
  setTimeout(() => {
    statusDiv.classList.remove('show');
    setTimeout(() => statusDiv.remove(), 300);
  }, 3000);
}
