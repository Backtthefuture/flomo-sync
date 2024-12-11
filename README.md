# Flomo Sync Chrome Extension

一个简单易用的 Chrome 扩展，帮助你在浏览网页时快速将内容同步到 Flomo。

## 功能特点

- 🚀 一键同步内容到 Flomo
- 📝 自动获取当前页面的标题和链接
- 📌 支持添加原文摘要和个人感想
- 🏷️ 可自定义默认标签
- ⌨️ 支持快捷键操作
- 🎨 简洁美观的侧边栏界面

## 安装方法

1. 下载本项目代码
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

## 使用说明

### 首次使用配置

1. 点击插件图标右键 -> 选择"选项"，或在插件侧边栏中点击设置图标（⚙️）
2. 在设置页面中填入你的 Flomo Webhook URL
   - Webhook URL 可以在 Flomo 的 API 设置中获取
3. 可选：自定义默认标签（默认为 #Chrome阅读笔记）

### 日常使用

1. **打开侧边栏**
   - 方式一：点击浏览器工具栏中的插件图标
   - 方式二：使用快捷键 `Alt+F`

2. **同步内容**
   - 标题和链接会自动填充
   - 在"原文摘要"框中粘贴想要保存的原文内容
   - 在"个人感想"框中输入你的想法
   - 点击"提交到 Flomo"按钮完成同步

### 同步内容格式

```
[文章标题](文章链接)

原文摘要：

摘要内容

个人感想：

感想内容

#Chrome阅读笔记
```

## 项目结构

```
├── manifest.json          # 插件配置文件
├── background.js         # 后台脚本
├── content.js           # 内容脚本
├── options.html         # 设置页面
├── options.js          # 设置页面脚本
├── styles/
│   └── sidebar.css     # 侧边栏样式
└── images/
    ├── icon16.png     # 插件图标
    ├── icon48.png     # 插件图标
    └── icon128.png    # 插件图标
```

## 隐私说明

- 插件仅在您主动点击提交时才会发送数据到 Flomo
- 仅收集当前页面的标题和 URL，以及您手动输入的内容
- 所有数据直接发送到您的 Flomo 账户，不经过任何第三方服务器

## 问题反馈

如果你在使用过程中遇到任何问题，或有任何功能建议，欢迎提出 Issue。

## License

MIT License