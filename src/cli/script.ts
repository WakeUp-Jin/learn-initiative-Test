#!/usr/bin/env node

import prompts from 'prompts';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import open from 'open';
import Handlebars from 'handlebars';
import { themes } from './themes.js';
import { config, logger } from '../config.js';

interface ActivityItem {
  title: string;
  content: string;
  time: string;
  type: 'video' | 'audio' | 'text';
  icon: string;
  sidebarType?: string;
}

interface ActivitySection {
  sectionTitle: string;
  sectionDescription: string;
  activities: ActivityItem[];
}

interface UserInput {
  templateType: 'simple' | 'oboe-course';
  title: string;
  content?: string;
  theme?: 'light' | 'dark';
  courseSubtitle?: string;
  courseDescription?: string;
  courseImage?: string;
  outputFormat: 'html' | 'json' | 'both';
}

interface OutputData {
  title: string;
  content?: string;
  theme?: string;
  timestamp: string;
  metadata: {
    generator: string;
    version: string;
  };
  // Oboe course specific fields
  siteName?: string;
  courseTitle?: string;
  courseSubtitle?: string;
  courseDescription?: string;
  courseImage?: string;
  activitySections?: ActivitySection[];
  topicList?: string[];
}

async function getUserInput(): Promise<UserInput> {
  logger.info('脚本HTML生成器启动');
  logger.dev('用户交互开始');
  console.log('🚀 欢迎使用脚本HTML生成器！\n');

  const response = await prompts([
    {
      type: 'select',
      name: 'templateType',
      message: '选择模板类型:',
      choices: [
        { title: '简单页面', value: 'simple' },
        { title: 'Oboe课程页面', value: 'oboe-course' }
      ],
      initial: 0
    },
    {
      type: 'text',
      name: 'title',
      message: (prev) => prev === 'oboe-course' ? '请输入课程标题:' : '请输入页面标题:',
      initial: (prev) => prev === 'oboe-course' ? 'Finding Your Ideal Trousers' : '我的页面'
    },
    {
      type: (prev, values) => values.templateType === 'simple' ? 'text' : null,
      name: 'content',
      message: '请输入页面内容:',
      initial: '这是一个由脚本生成的页面'
    },
    {
      type: (prev, values) => values.templateType === 'simple' ? 'select' : null,
      name: 'theme',
      message: '选择主题:',
      choices: [
        { title: '浅色主题', value: 'light' },
        { title: '深色主题', value: 'dark' }
      ],
      initial: config.defaultTheme === 'light' ? 0 : 1
    },
    {
      type: (prev, values) => values.templateType === 'oboe-course' ? 'text' : null,
      name: 'courseSubtitle',
      message: '请输入课程副标题:',
      initial: 'for Every Occasion'
    },
    {
      type: (prev, values) => values.templateType === 'oboe-course' ? 'text' : null,
      name: 'courseDescription',
      message: '请输入课程描述:',
      initial: 'This course explores the principles of selecting pants that flatter your body type, suit different occasions, and reflect your personal style.'
    },
    {
      type: (prev, values) => values.templateType === 'oboe-course' ? 'text' : null,
      name: 'courseImage',
      message: '请输入课程图片URL (可选，留空使用默认图标):',
      initial: ''
    },
    {
      type: 'select',
      name: 'outputFormat',
      message: '选择输出格式:',
      choices: [
        { title: '仅HTML', value: 'html' },
        { title: '仅JSON', value: 'json' },
        { title: '两者都输出', value: 'both' }
      ],
      initial: 2
    }
  ]);

  if (Object.keys(response).length === 0) {
    logger.warn('用户取消操作');
    console.log('✋ 操作已取消');
    process.exit(0);
  }

  logger.dev(`用户选择: ${response.templateType} 模板`);
  logger.debug(`用户输入: ${JSON.stringify(response, null, 2)}`);
  
  return response as UserInput;
}

function generateOutputData(input: UserInput): OutputData {
  logger.dev('开始生成输出数据');
  
  const baseData: OutputData = {
    title: input.title,
    timestamp: new Date().toISOString(),
    metadata: {
      generator: 'script-html-generator',
      version: '1.0.0'
    }
  };

  if (input.templateType === 'simple') {
    logger.dev('生成简单页面数据');
    return {
      ...baseData,
      content: input.content,
      theme: input.theme
    };
  } else {
    logger.dev('生成Oboe课程数据');
    return {
      ...baseData,
      siteName: config.siteName,
      courseTitle: input.title,
      courseSubtitle: input.courseSubtitle,
      courseDescription: input.courseDescription,
      courseImage: input.courseImage || undefined,
      activitySections: getDefaultActivitySections(),
      topicList: getDefaultTopicList()
    };
  }
}

function getDefaultActivitySections(): ActivitySection[] {
  return [
    {
      sectionTitle: 'Learn',
      sectionDescription: 'Start picking perfect pants that fit your style and needs.',
      activities: [
        {
          title: 'Deep Dive',
          content: 'Comprehensive guide to trouser selection',
          time: '10 min read',
          type: 'text',
          icon: '🎯',
          sidebarType: 'deep-dive'
        },
        {
          title: 'Podcast Episode',
          content: 'Audio guide to pants fitting',
          time: '10 min listen',
          type: 'audio',
          icon: '🎧'
        },
        {
          title: 'Key Takeaways',
          content: 'Summary of important points',
          time: '2 min read',
          type: 'text',
          icon: '📝',
          sidebarType: 'key-takeaways'
        },
        {
          title: 'Lecture Recording',
          content: 'Video lecture on trouser selection',
          time: '15 min listen',
          type: 'video',
          icon: '🎥'
        }
      ]
    },
    {
      sectionTitle: 'Study',
      sectionDescription: 'Sharpen your outfit choices by rehearsing pant selection skills.',
      activities: [
        {
          title: 'Frequently Asked Questions',
          content: 'Common questions about pants',
          time: '3 min read',
          type: 'text',
          icon: '❓'
        },
        {
          title: 'Flashcards',
          content: 'Memory cards for key concepts',
          time: '5 min drill',
          type: 'text',
          icon: '📚'
        },
        {
          title: 'Word Quest',
          content: 'Interactive vocabulary game',
          time: '5 min play',
          type: 'text',
          icon: '🔤'
        }
      ]
    },
    {
      sectionTitle: 'Quiz',
      sectionDescription: 'Test your knowledge on selecting pants for any occasion.',
      activities: [
        {
          title: 'Multiple Choice',
          content: 'Multiple choice quiz',
          time: '7 min quiz',
          type: 'text',
          icon: '🔢'
        },
        {
          title: 'True or False',
          content: 'True/false questions',
          time: '5 min quiz',
          type: 'text',
          icon: '✅'
        }
      ]
    }
  ];
}

function getDefaultTopicList(): string[] {
  return [
    'Why do trousers fit differently across brands and styles?',
    'Designing Trousers for Performance and Comfort',
    'How do fabric choices impact trouser drape and longevity?',
    'Creating Timeless Trouser Silhouettes for Any Wardrobe',
    'What historical shifts shaped modern trouser design?',
    'Mastering Trouser Alterations for a Perfect Fit',
    'How do cultural contexts influence trouser fashion?',
    'Exploring Sustainable Practices in Trouser Manufacturing'
  ];
}

function generateHTML(data: OutputData, templateType: 'simple' | 'oboe-course'): string {
  const templateName = templateType === 'simple' ? 'page' : 'oboe-course';
  const templatePath = join(config.templatesDir, `${templateName}.hbs`);
  
  logger.dev(`使用模板: ${templatePath}`);
  
  const templateSource = readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  
  if (templateType === 'simple') {
    const themeConfig = themes[data.theme as 'light' | 'dark'];
    const templateVariables = {
      title: data.title,
      content: data.content,
      timestamp: new Date(data.timestamp).toLocaleString('zh-CN'),
      generator: data.metadata.generator,
      version: data.metadata.version,
      ...themeConfig
    };
    logger.debug(`简单页面变量: ${Object.keys(templateVariables).join(', ')}`);
    return template(templateVariables);
  } else {
    logger.debug(`Oboe课程变量: ${Object.keys(data).join(', ')}`);
    return template(data);
  }
}

async function saveFiles(data: OutputData, format: string, templateType: 'simple' | 'oboe-course'): Promise<string[]> {
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
    logger.dev(`创建输出目录: ${config.outputDir}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const savedFiles: string[] = [];
  const prefix = templateType === 'simple' ? 'output' : 'oboe-course';

  logger.info(`开始保存文件，格式: ${format}`);

  if (format === 'json' || format === 'both') {
    const jsonPath = join(config.outputDir, `${prefix}-${timestamp}.json`);
    writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    savedFiles.push(jsonPath);
    logger.success(`JSON文件已保存: ${jsonPath}`);
    console.log(`✅ JSON文件已保存: ${jsonPath}`);
  }

  if (format === 'html' || format === 'both') {
    const htmlContent = generateHTML(data, templateType);
    const htmlPath = join(config.outputDir, `${prefix}-${timestamp}.html`);
    writeFileSync(htmlPath, htmlContent, 'utf-8');
    savedFiles.push(htmlPath);
    logger.success(`HTML文件已保存: ${htmlPath}`);
    console.log(`✅ HTML文件已保存: ${htmlPath}`);
  }

  logger.info(`文件保存完成，共 ${savedFiles.length} 个文件`);
  return savedFiles;
}

async function main() {
  try {
    logger.info('应用启动');
    const userInput = await getUserInput();
    const outputData = generateOutputData(userInput);
    
    logger.info('开始生成文件');
    console.log('\n📝 正在生成文件...');
    const savedFiles = await saveFiles(outputData, userInput.outputFormat, userInput.templateType);
    
    const htmlFile = savedFiles.find(file => file.endsWith('.html'));
    if (htmlFile && config.autoOpenBrowser) {
      const shouldOpen = await prompts({
        type: 'confirm',
        name: 'openFile',
        message: '是否在浏览器中打开生成的HTML文件?',
        initial: true
      });

      if (shouldOpen.openFile) {
        await open(htmlFile);
        logger.success('HTML文件已在浏览器中打开');
        console.log('🌐 HTML文件已在浏览器中打开');
      }
    } else if (htmlFile && !config.autoOpenBrowser) {
      logger.dev('自动打开浏览器被禁用');
    }

    logger.info('任务完成');
    console.log('\n🎉 任务完成！');
  } catch (error) {
    logger.error(`应用执行失败: ${error}`);
    console.error('❌ 发生错误:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateHTML, generateOutputData, ActivityItem, ActivitySection };