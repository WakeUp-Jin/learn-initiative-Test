import { describe, it, expect, beforeAll } from 'vitest';
import { generateHTML, generateOutputData } from '../src/script.js';
import { TemplateEngine } from '../src/template-engine.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

describe('HTML Generator', () => {
  beforeAll(() => {
    // 确保测试模板目录存在
    if (!existsSync('./templates')) {
      mkdirSync('./templates', { recursive: true });
    }
    
    // 创建测试模板文件
    const testTemplate = `<!DOCTYPE html>
<html>
<head><title>{{title}}</title></head>
<body>
  <h1>{{title}}</h1>
  <p>{{content}}</p>
  <footer>{{generator}} v{{version}}</footer>
</body>
</html>`;
    
    writeFileSync('./templates/page.hbs', testTemplate);
  });
  it('should generate output data correctly', () => {
    const input = {
      title: 'Test Title',
      content: 'Test Content',
      theme: 'light' as const,
      outputFormat: 'html' as const
    };

    const result = generateOutputData(input);

    expect(result.title).toBe('Test Title');
    expect(result.content).toBe('Test Content');
    expect(result.theme).toBe('light');
    expect(result.metadata.generator).toBe('script-html-generator');
    expect(result.metadata.version).toBe('1.0.0');
    expect(result.timestamp).toBeDefined();
  });

  it('should generate HTML with light theme', () => {
    const data = {
      title: 'Test Page',
      content: 'Test content here',
      theme: 'light',
      timestamp: '2023-01-01T00:00:00.000Z',
      metadata: {
        generator: 'test-generator',
        version: '1.0.0'
      }
    };

    const html = generateHTML(data);

    expect(html).toContain('Test Page');
    expect(html).toContain('Test content here');
    expect(html).toContain('test-generator v1.0.0');
  });

  it('should generate HTML with dark theme', () => {
    const data = {
      title: 'Dark Page',
      content: 'Dark content',
      theme: 'dark',
      timestamp: '2023-01-01T00:00:00.000Z',
      metadata: {
        generator: 'test-generator',
        version: '1.0.0'
      }
    };

    const html = generateHTML(data);

    expect(html).toContain('Dark Page');
    expect(html).toContain('Dark content');
    expect(html).toContain('test-generator v1.0.0');
  });
});

describe('Template Engine', () => {
  it('should render template with variables', () => {
    const engine = new TemplateEngine();
    const result = engine.render('page', {
      title: 'Test Title',
      content: 'Test Content',
      generator: 'test-generator',
      version: '1.0.0'
    });
    
    expect(result).toContain('Test Title');
    expect(result).toContain('Test Content');
    expect(result).toContain('test-generator v1.0.0');
  });
  
  it('should check if template exists', () => {
    const engine = new TemplateEngine();
    expect(engine.templateExists('page')).toBe(true);
    expect(engine.templateExists('nonexistent')).toBe(false);
  });
});