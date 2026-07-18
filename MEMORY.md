# MEMORY.md

## 项目上下文

- **项目名:** Light Portfolio — 个人作品集网站
- **技术栈:** Astro 4.16.2 + 原生 CSS + 原生 JS 动画
- **部署:** 静态站点，`astro build` + `node serve.js` 预览
- **当前日期:** 2026-07-16

## 架构决策

1. **选择 Astro 而非 React/Next.js** — 内容展示为主，不需要复杂交互，Astro 加载更快、更简单
2. **独立分类页而非单页筛选** — 每个分类一个独立页面（/practice, /mobile, /web, /h5-graphic），URL 可分享
3. **Hero 区域用沉浸式大图** — 全屏背景 + 左侧文字 + 竖列导航按钮
4. **作品卡片用 CSS 无限滚动 + 悬停暂停** — 纯 CSS animation + 一行 JS 实现
5. **导航栏固定顶部 + 毛玻璃效果** — backdrop-filter: blur
6. **不使用 Astro layout 机制** — Windows 上 layout frontmatter 被静默忽略，改为在每个页面文件中 inline 引入 CSS

## 踩坑记录

### ⚠️ Astro layout frontmatter 在 Windows 上静默失效（CRITICAL）

**问题：** Astro 的 `layout` frontmatter 在 Windows 上完全不被应用，页面没有 `<head>` 标签，CSS 和字体都不会加载。构建不报错，但产出 HTML 缺少所有元信息。

**根因：** Astro 在 Windows 的 esbuild 打包中对 layout 的处理有平台差异 bug。

**解决方案：** 在每个 `.astro` 页面文件中直接写 `<head>` 标签引入 CSS 和字体，不依赖 layout。

**验证方法：** 每次修改页面后跑 `astro build`，检查 `dist/index.html` 是否包含 `<link rel="stylesheet">`。

### ⚠️ PowerShell 写入 Astro 文件的双引号转义问题

**问题：** 使用 `$content = @" ... "@` heredoc 语法写入 Astro 文件时，双引号会被双重转义（`""` 代替 `"`），导致 HTML 属性全部损坏，esbuild 报 Unexpected "." 错误。

**根因：** PowerShell 的 here-string 语法对 Astro 模板中的 `"` 做了额外转义。

**解决方案：**
- 使用 `Set-Content` 写入时注意双引号处理
- 或使用 `[System.IO.File]::WriteAllBytes()` 直接写字节数组
- **永远不要用 heredoc 写 .astro 文件**

**验证方法：** 每次写完文件后立即 `astro build` 验证，不要攒一堆再查。

### ⚠️ Windows 上 Node 进程生命周期管理（CRITICAL）

**问题：** `astro dev`、`astro preview`、`npx http-server` 等命令在当前 PowerShell 会话中运行时，一旦命令超时或会话退出，进程被连带杀掉，端口释放，浏览器 `ERR_CONNECTION_REFUSED`。关闭窗口后进程立即消失。

**根因：** 当前 shell 是这些进程的父进程，父进程退出或超时会导致子进程被终止。

**解决方案：**
- 使用 Node.js 原生 `http` 模块编写 `serve.js`，通过 `Start-Process node -ArgumentList "serve.js" -WindowStyle Hidden` 启动
- `-WindowStyle Hidden` 以隐藏窗口方式运行，不依赖任何 PowerShell 窗口
- 用 `netstat -ano | findstr :3000` 确认进程存活
- 用 `Stop-Process -Id <PID>` 停止指定端口进程

**预览命令：**
```powershell
# 启动
Start-Process node -ArgumentList "serve.js" -WindowStyle Hidden -WorkingDirectory "B:\GuPiaoUI"

# 检查端口
netstat -ano | findstr :3000

# 停止
Stop-Process -Id <PID> -Force
```

### ⚠️ Astro 开发服务器在 Windows 上不稳定

**问题：** `astro dev` 经常超时、连接断开、端口占用混乱。

**解决方案：**
- 开发阶段用 `astro build` 生成静态文件后用 `node serve.js` 预览
- 端口冲突时先用 `netstat -ano | findstr :PORT` 查找 PID 再 kill

## 文件结构

```
src/
├── pages/
│   ├── index.astro            # 首页（Hero + About + Works + Contact）
│   ├── practice.astro         # 实践项目分类页
│   ├── mobile.astro           # 移动端项目分类页
│   ├── web.astro              # Web端项目分类页
│   └── h5-graphic.astro       # H5 & 平面项目分类页
└── styles/global.css          # 全局样式（CSS Variables + 所有页面样式）
serve.js                       # Node.js 静态文件服务器（用于本地预览）
public/
└── favicon.svg
```

**注意：** `layouts/` 目录已删除，不再使用 Astro layout 机制。

## 设计规范

- **配色：** #FF4D4D (红), #FFD60A (黄), #00C2FF (蓝), #7B2FFF (紫), #00E59B (薄荷绿)
- **字体：** Space Grotesk (标题), Inter (正文)
- **风格：** Bold, colorful, neo-brutalist

## 响应式优化（持续跟进）

**原则：** 每次新增/修改页面时，同步检查移动端表现。
**检查清单：**
- [ ] 导航栏在小屏幕下是否正确折叠为汉堡菜单
- [ ] Hero 区域文字大小和位置是否适配
- [ ] 作品卡片滚动在移动端是否正常
- [ ] 竖列导航按钮在移动端是否合理
- [ ] 各页面内容在小屏幕下是否有文字溢出、重叠
- [ ] 触摸目标（按钮、链接）是否 ≥ 44px

---

## 待办事项

- [ ] 替换 Hero 背景图为 `封面 (1).png`
- [ ] 填充真实项目内容和截图
- [ ] 实现移动端汉堡菜单展开/收起逻辑
- [ ] 添加项目详情页（长滚动故事页）
- [ ] 优化首屏加载性能（图片懒加载）



## 代码修改原则

- **最小改动原则：** 每次修改只改动必要的代码，绝不触碰无关部分
- **精准定位：** 修改前先确认问题所在，只改那一行或那一段
- **避免副作用：** 不要为了顺便修而去碰其他代码，哪怕它们看起来有问题

## 交互规则

- **修改代码前必须获得用户明确同意** — 先描述修改方案，用户确认后再生成代码
- 分析、解释、建议可以不做审批直接给出
- 但任何 pply_patch、Set-Content、文件写入等操作，必须先告诉用户"我要改 XXX，改成 YYY"，等用户说"可以"再动手

- **最小改动原则：** 每次修改只改动必要的代码，绝不触碰无关部分
- **精准定位：** 修改前先确认问题所在，只改那一行或那一段
- **避免副作用：** 不要为了顺便修而去碰其他代码，哪怕它们看起来有问题



## 反思总结

### 导航卡片展开方向

- **问题：** 初始使用 ottom: calc(100% + 8px) 让卡片从胶囊上方展开，但页面顶部已是视口边界，卡片被推出屏幕外
- **教训：** 定位元素时，必须先考虑页面布局空间。固定定位在顶部的导航栏，展开内容应该向下而非向上
- **修正：** 改为 	op: calc(100% + 8px) + 	ransform: translateY(-10px)`n
### CSS 全局替换的陷阱

- **问题：** 用 -replace 'overflow: hidden', 'visible' 全局替换时，误伤了 Hero 区域的 overflow: hidden（需要保留以裁剪伪元素）
- **教训：** 全局字符串替换极易产生副作用。应该用行号精确定位修改
- **修正：** 后续修改 CSS 时，先 Select-String 确认所有匹配位置，再用行号精确修改

#
## 代码修改原则

- **最小改动原则：** 每次修改只改动必要的代码，绝不触碰无关部分
- **精准定位：** 修改前先确认问题所在，只改那一行或那一段
- **避免副作用：** 不要为了顺便修而去碰其他代码，哪怕它们看起来有问题

## 交互规则

- **修改代码前必须获得用户明确同意** — 先描述修改方案，用户确认后再生成代码
- 分析、解释、建议可以不做审批直接给出
- 但任何 pply_patch、Set-Content、文件写入等操作，必须先告诉用户"我要改 XXX，改成 YYY"，等用户说"可以"再动手（已记录）

- 每次修改只改动必要的代码，绝不触碰无关部分
- 精准定位：修改前先确认问题所在，只改那一行或那一段
- 避免副作用：不要为了'顺便修'而去碰其他代码




## 技能贴纸交互效果（2026-07-18 新增）

- **实现方式：** 纯 CSS + 原生 JS（无 GSAP 依赖）
- **交互功能：**
  - 鼠标悬停：轻微放大（scale 1.05）+ 旋转 + 阴影加深
  - 鼠标拖拽：可拖动贴纸到新位置
  - 点击保持：拖动后释放，位置保持不变
- **CSS 改动：**
  - .sticker：pointer-events: auto（原 none）、cursor: grab、	ransition
  - .sticker:hover：ox-shadow 加深、cursor: grabbing
  - 贴纸位置微调（更随机的旋转角度）
- **JS 改动：**
  - 在 index.astro 末尾添加 <script> 块
  - 监听 mousedown/mousemove/mouseup 实现拖拽
  - 监听 mouseenter/mouseleave 实现悬停动画
- **注意事项：**
  - 移动端 .sticker 仍为 display: none
  - 拖拽后 z-index 临时提升为 10，释放后恢复 3
  - 原始旋转角度存储在 data-rotation 属性中

## 修复：信息卡片竖排问题（2026-07-18）

- **问题：** 三个主信息卡片（Basic Info, Education, Experience）竖排显示而非横排
- **原因：** HTML 中三个 .about-card 是 .about-grid 的直接子元素，没有被 .about-row 包裹
- **解决方案：** 用 <div class="about-row"> 包裹三个 .about-card div
- **CSS 依据：** .about-row 已有 display: flex; flex-direction: row 样式，只是 HTML 没用到

## ⚠️ 重构 HTML 区块时误删后续内容（CRITICAL）

**时间：** 2026-07-18

**问题：** 用 $content.Substring() 截取并替换 index.astro 中的 About 区域时，$aboutEnd 找到的位置是 <!-- Sticker Interactions --> 注释，导致该注释之后的 Works、Contact、Footer 全部被丢弃。

**根因：** 用字符串索引定位区块边界非常脆弱。当目标注释出现在多个位置（Sticker Interactions 脚本内也有类似注释）时，IndexOf 会找到错误的位置。

**教训：**
- 不要对整个文件做 Substring 级别的粗暴替换
- 优先用行号定位 + 逐行插入/替换
- 或者用 Select-String 确认所有匹配位置后再操作
- 修改 HTML 结构后，**立即验证**所有 section 标签是否成对闭合

**修正：** 用 [ArrayList].Insert() 在精确行号处插入缺失的 section 内容。
