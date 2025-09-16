# Script HTML Generator

一个交互式的HTML生成器脚本，通过终端输入生成HTML和JSON文件。

## 🏗️ 技术栈

- **Node.js**: 脚本运行时环境
- **TypeScript**: 类型系统，增强开发体验
- **pnpm**: 高效的包管理器
- **Vitest**: 轻量测试框架
- **prompts**: 终端交互
- **open**: 在浏览器中打开生成的文件

## 📦 安装

```bash
# 安装依赖
pnpm install
```

## 🚀 使用方法

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
- 🎨 **主题支持**: 支持亮色和暗色两种主题
- 📄 **多格式输出**: 支持HTML、JSON或两者同时输出
- 🌐 **自动打开**: 可选择在浏览器中自动打开生成的HTML文件
- ⚡ **即时预览**: 生成后立即查看效果

## 🏗️ 架构设计

### 模板系统
项目采用了模块化的模板引擎设计：

- **模板引擎** (`template-engine.ts`): 简单的变量替换引擎，支持 `{{variable}}` 语法
- **主题配置** (`themes.ts`): 集中管理浅色和深色主题的样式配置
- **模板文件** (`page.hbs`): 独立的HTML模板文件，支持变量替换

### 优势
- ✨ **可扩展性**: 轻松添加新主题或修改现有样式
- 🔧 **可维护性**: 模板与逻辑分离，便于维护
- 📝 **易于编辑**: 模板文件可以直接编辑，无需修改代码
- 🎨 **主题管理**: 集中的主题配置，便于主题定制

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