# Script HTML Generator

一个交互式的HTML生成器脚本，通过终端输入生成HTML和JSON文件。

## 🏗️ 技术栈

- **Node.js**: 脚本运行时环境
- **TypeScript**: 类型系统，增强开发体验
- **pnpm**: 高效的包管理器
- **Vitest**: 轻量测试框架
- **Handlebars**: 专业模板引擎
- **prompts**: 终端交互
- **open**: 在浏览器中打开生成的文件
- **dotenv**: 环境变量管理




## 🔧 环境配置

### 环境变量
复制 `.env.example` 为 `.env` 并根据需要修改配置：

```bash
cp .env.example .env
```

### 可用环境变量

```bash
# 运行环境 (development, production, test)
NODE_ENV=development

# 网站配置
SITE_NAME=Oboe
OUTPUT_DIR=./output
TEMPLATES_DIR=./templates
DEFAULT_THEME=light

# 浏览器配置
AUTO_OPEN_BROWSER=true

# 日志配置
LOG_LEVEL=debug          # debug, info, warn, error
ENABLE_CONSOLE_LOG=true
```

### 环境差异
- **开发环境** (`NODE_ENV=development`): 显示详细调试日志，包含文件操作信息
- **生产环境** (`NODE_ENV=production`): 仅显示关键信息和错误日志
- **测试环境** (`NODE_ENV=test`): 适用于自动化测试的最小日志输出

## 📦 安装

```bash
# 安装依赖
pnpm install
```

## 🚀 使用方法

### 环境变量控制
```bash
# 开发环境运行（显示详细日志）
NODE_ENV=development pnpm run script

# 生产环境运行（简洁日志）
NODE_ENV=production pnpm run script

# 禁用自动打开浏览器
AUTO_OPEN_BROWSER=false pnpm run script

# 设置日志级别
LOG_LEVEL=error pnpm run script
```

### 运行脚本
```bash
# 直接运行（推荐）
pnpm run script

# 或者先构建再运行
pnpm run build
pnpm start
```

### 开发模式
```bash
# 监听文件变化并自动编译
pnpm run dev
```

### 运行测试
```bash
# 运行测试
pnpm test

# 运行测试一次
pnpm run test:run
```

## 🎯 功能特性

- 🖥️ **终端交互**: 通过命令行界面输入内容
- 🎨 **双模板支持**: 简单页面和Oboe课程页面模板
- 🌈 **主题支持**: 支持亮色和暗色两种主题  
- 📄 **多格式输出**: 支持HTML、JSON或两者同时输出
- 🌐 **智能打开**: 可配置的浏览器自动打开功能
- ⚡ **即时预览**: 生成后立即查看效果
- 🔧 **环境配置**: 完善的环境变量管理
- 📊 **智能日志**: 根据环境显示不同详细程度的日志
- 🎯 **动态数据**: 支持活动列表、话题列表等动态内容

## 🏗️ 架构设计

### 模板系统
项目采用了专业的Handlebars模板引擎：

- **Handlebars引擎**: 功能强大的模板系统，支持循环、条件判断
- **主题配置** (`themes.ts`): 集中管理浅色和深色主题的样式配置  
- **环境配置** (`config.ts`): 统一的配置管理和日志系统
- **模板文件**: 
  - `page.hbs`: 简单页面模板
  - `oboe-course.hbs`: Oboe课程页面模板，支持动态活动列表

### 优势
- ✨ **可扩展性**: 轻松添加新模板或修改现有样式
- 🔧 **可维护性**: 模板与逻辑分离，便于维护
- 📝 **易于编辑**: 模板文件可以直接编辑，支持复杂逻辑
- 🎨 **主题管理**: 集中的主题和环境配置
- 🔄 **动态内容**: 支持数组循环和条件渲染

## 📁 项目结构

```
test-learn-initiative/
├── src/                     # 源代码
│   ├── script.ts           # 主脚本文件
│   ├── template-engine.ts  # 模板引擎
│   └── themes.ts           # 主题配置
├── templates/              # HTML模板
│   └── page.hbs           # 页面模板（Handlebars格式）
├── tests/                  # 测试文件
│   └── script.test.ts     # 脚本测试
├── output/                # 输出文件目录（自动创建）
├── dist/                  # 编译后的文件
└── package.json           # 项目配置
```

## 🔧 输出格式

### JSON输出
脚本会生成包含以下结构的JSON文件：
```json
{
  "title": "页面标题",
  "content": "页面内容",
  "theme": "light",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "metadata": {
    "generator": "script-html-generator",
    "version": "1.0.0"
  }
}
```

### HTML输出
基于JSON数据生成的响应式HTML页面，支持：
- 自适应设计
- 主题切换
- 中文字体优化
- 清晰的页面结构

## 🎨 主题

- **浅色主题**: 白色背景，深色文字
- **深色主题**: 深色背景，浅色文字

## 📈 扩展性

采用JSON作为中间数据格式，便于：
- 添加新的输出格式
- 集成到其他系统
- 数据复用和处理
- 模板系统扩展