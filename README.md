# AI 3D Explorer

基于 Three.js 的 AI 3D 场景探索应用。用户通过文字描述生成 AI 全景环境图，并实时应用到 3D 场景中，实现沉浸式的环境探索体验。

## 功能特性

- 🌍 **3D 场景漫游** — 使用 WASD / 方向键控制角色在 3D 场景中自由行走
- 🤖 **AI 环境生成** — 输入文字描述（如"赛博朋克城市"），AI 自动生成 360° 全景环境图
- 🎨 **实时环境切换** — 生成的全景图无缝替换当前场景背景，带有淡入淡出过渡效果
- 🏃 **角色动画** — 角色行走时有四肢摆动动画，静止时有轻微浮动呼吸效果
- 📷 **第三人称相机** — 相机平滑跟随角色移动

## 技术栈

- **前端**：Three.js (r128)、原生 HTML/CSS/JavaScript
- **后端**：Node.js + Express
- **AI 图片生成**：豆包 Seedream 图片生成 API（火山引擎）

## 安装与运行

### 1. 克隆仓库

```bash
git clone https://github.com/YuhaoYeSteve/ai-3d-explorer.git
cd ai-3d-explorer
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```
ARK_API_KEY=你的豆包API密钥
```

> API 密钥可在 [火山引擎控制台](https://console.volcengine.com/ark) 获取。

### 4. 启动服务

```bash
node server.js
```

打开浏览器访问 http://localhost:3000

## 使用方法

1. 页面加载后，你将看到一个 3D 场景和一个小人角色
2. 使用 **W/A/S/D** 或 **方向键** 控制角色移动
3. 在底部聊天框中输入环境描述，例如：
   - "赛博朋克城市"
   - "热带海滩日落"
   - "雪山冰川"
   - "魔法森林"
4. AI 将生成对应的 360° 全景图并应用到场景中

## 项目结构

```
ai-3d-explorer/
├── server.js           # Express 后端服务，代理 AI 图片生成 API
├── package.json        # 项目依赖配置
├── .env                # 环境变量（需自行创建，不包含在仓库中）
├── .gitignore
└── public/
    ├── index.html      # 主页面
    ├── style.css       # 样式文件
    └── game.js         # Three.js 3D 场景逻辑
```

## 许可证

MIT
