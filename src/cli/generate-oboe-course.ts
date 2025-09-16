#!/usr/bin/env node

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import open from 'open';
import Handlebars from 'handlebars';

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

interface OboeCourseData {
  siteName: string;
  courseTitle: string;
  courseSubtitle: string;
  courseDescription: string;
  courseImage?: string;
  activitySections: ActivitySection[];
  topicList: string[];
}

function generateOboeCourse(): void {
  // 从图片中提取的数据
  const courseData: OboeCourseData = {
    siteName: 'Oboe',
    courseTitle: 'Finding Your Ideal Trousers',
    courseSubtitle: 'for Every Occasion',
    courseDescription: 'This course explores the principles of selecting pants that flatter your body type, suit different occasions, and reflect your personal style.',
    
    activitySections: [
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
    ],
    
    topicList: [
      'Why do trousers fit differently across brands and styles?',
      'Designing Trousers for Performance and Comfort',
      'How do fabric choices impact trouser drape and longevity?',
      'Creating Timeless Trouser Silhouettes for Any Wardrobe',
      'What historical shifts shaped modern trouser design?',
      'Mastering Trouser Alterations for a Perfect Fit',
      'How do cultural contexts influence trouser fashion?',
      'Exploring Sustainable Practices in Trouser Manufacturing'
    ]
  };

  // 生成HTML
  const templatePath = join('./templates', 'oboe-course.hbs');
  const templateSource = readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  const html = template(courseData);

  // 保存文件
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const htmlPath = join(outputDir, `oboe-course-${timestamp}.html`);
  
  writeFileSync(htmlPath, html, 'utf-8');
  
  console.log(`✅ Oboe课程页面已生成: ${htmlPath}`);
  
  // 自动打开浏览器
  open(htmlPath);
  console.log('🌐 页面已在浏览器中打开');
}

// 立即生成
generateOboeCourse();