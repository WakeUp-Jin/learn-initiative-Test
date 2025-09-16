export interface ThemeConfig {
  themeStyles: string;
  containerStyles: string;
  footerColor: string;
  borderColor: string;
}

export const themes: Record<'light' | 'dark', ThemeConfig> = {
  light: {
    themeStyles: 'background-color: #ffffff; color: #333333;',
    containerStyles: 'background-color: #fafafa; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;',
    footerColor: '#666666',
    borderColor: '#e0e0e0'
  },
  dark: {
    themeStyles: 'background-color: #1a1a1a; color: #ffffff;',
    containerStyles: 'background-color: #2d2d2d; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 1px solid #404040;',
    footerColor: '#999999',
    borderColor: '#404040'
  }
};