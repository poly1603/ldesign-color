import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ColorGenerator } from '../src/core/ColorGenerator';
import { CSSVariableGenerator } from '../src/core/CSSVariableGenerator';
import { PaletteGenerator } from '../src/core/PaletteGenerator';
import { SemanticColorGenerator } from '../src/core/SemanticColorGenerator';
import { isValidColor } from '../src/utils/colorUtils';

describe('核心功能测试', () => {
  describe('SemanticColorGenerator', () => {
    let generator: SemanticColorGenerator;

    beforeEach(() => {
      generator = new SemanticColorGenerator();
    });

    it('应该生成语义化颜色', () => {
      const colors = generator.generateSemanticColors('#1890ff');

      expect(colors.primary).toBe('#1890ff');
      expect(isValidColor(colors.success)).toBe(true);
      expect(isValidColor(colors.warning)).toBe(true);
      expect(isValidColor(colors.danger)).toBe(true);
      expect(isValidColor(colors.gray)).toBe(true);
    });

    it('应该为不同主色调生成不同的语义化颜色', () => {
      const blueColors = generator.generateSemanticColors('#1890ff');
      const redColors = generator.generateSemanticColors('#f5222d');

      expect(blueColors.success).not.toBe(redColors.success);
      expect(blueColors.warning).not.toBe(redColors.warning);
    });
  });

  describe('PaletteGenerator', () => {
    let generator: PaletteGenerator;
    let semanticColors: any;

    beforeEach(() => {
      generator = new PaletteGenerator();
      semanticColors = {
        primary: '#1890ff',
        success: '#52c41a',
        warning: '#faad14',
        danger: '#f5222d',
        gray: '#8c8c8c'
      };
    });

    it('应该生成正确数量的色阶', () => {
      const palettes = generator.generateColorPalettes(semanticColors);

      // 明亮模式
      expect(palettes.light.primary).toHaveLength(12);
      expect(palettes.light.success).toHaveLength(12);
      expect(palettes.light.warning).toHaveLength(12);
      expect(palettes.light.danger).toHaveLength(12);
      expect(palettes.light.gray).toHaveLength(14);

      // 暗黑模式
      expect(palettes.dark.primary).toHaveLength(12);
      expect(palettes.dark.success).toHaveLength(12);
      expect(palettes.dark.warning).toHaveLength(12);
      expect(palettes.dark.danger).toHaveLength(12);
      expect(palettes.dark.gray).toHaveLength(14);
    });

    it('应该生成有效的颜色', () => {
      const palettes = generator.generateColorPalettes(semanticColors);

      // 检查所有颜色都是有效的
      Object.values(palettes.light).forEach(colors => {
        colors.forEach((color: string) => {
          expect(isValidColor(color)).toBe(true);
        });
      });

      Object.values(palettes.dark).forEach(colors => {
        colors.forEach((color: string) => {
          expect(isValidColor(color)).toBe(true);
        });
      });
    });
  });

  describe('CSSVariableGenerator', () => {
    let generator: CSSVariableGenerator;
    let palettes: any;

    beforeEach(() => {
      generator = new CSSVariableGenerator();
      palettes = {
        light: {
          primary: Array(12).fill('#1890ff'),
          success: Array(12).fill('#52c41a'),
          warning: Array(12).fill('#faad14'),
          danger: Array(12).fill('#f5222d'),
          gray: Array(14).fill('#8c8c8c')
        },
        dark: {
          primary: Array(12).fill('#1890ff'),
          success: Array(12).fill('#52c41a'),
          warning: Array(12).fill('#faad14'),
          danger: Array(12).fill('#f5222d'),
          gray: Array(14).fill('#8c8c8c')
        }
      };
    });

    it('应该生成CSS变量', () => {
      const cssVariables = generator.generateCSSVariables(palettes);

      expect(cssVariables).toContain('--ldesign-primary-');
      expect(cssVariables).toContain('--ldesign-success-');
      expect(cssVariables).toContain('--ldesign-warning-');
      expect(cssVariables).toContain('--ldesign-danger-');
      expect(cssVariables).toContain('--ldesign-gray-');
      expect(cssVariables).toContain('--ldesign-dark-');
    });

    it('应该生成SCSS变量', () => {
      const scssVariables = generator.generateSCSSVariables(palettes);

      expect(scssVariables).toContain('$ldesign-primary-');
      expect(scssVariables).toContain('$ldesign-dark-primary-');
    });

    it('应该生成Less变量', () => {
      const lessVariables = generator.generateLessVariables(palettes);

      expect(lessVariables).toContain('@ldesign-primary-');
      expect(lessVariables).toContain('@ldesign-dark-primary-');
    });
  });

  describe('ColorGenerator集成测试', () => {
    let colorGenerator: ColorGenerator;

    beforeEach(() => {
      colorGenerator = new ColorGenerator({
        enableCache: false,
        useWebWorker: false,
        autoInject: false
      });
    });

    afterEach(() => {
      colorGenerator.destroy();
    });

    it('应该生成完整的主题', () => {
      const theme = colorGenerator.generate('#1890ff');

      expect(theme).toBeDefined();
      expect(theme.semanticColors).toBeDefined();
      expect(theme.palettes).toBeDefined();
      expect(theme.cssVariables).toBeDefined();
      expect(theme.timestamp).toBeGreaterThan(0);
    });

    it('应该异步生成主题', async () => {
      const theme = await colorGenerator.generateAsync('#1890ff');

      expect(theme).toBeDefined();
      expect(theme.semanticColors.primary).toBe('#1890ff');
    });

    it('应该批量生成主题', async () => {
      const colors = ['#1890ff', '#52c41a', '#f5222d'];
      const themes = await colorGenerator.batchGenerate(colors);

      expect(themes).toHaveLength(3);
      themes.forEach((theme, index) => {
        expect(theme.semanticColors.primary).toBe(colors[index]);
      });
    });

    it('应该处理无效颜色', () => {
      expect(() => {
        colorGenerator.generate('invalid-color');
      }).toThrow();
    });

    it('应该支持配置更新', () => {
      colorGenerator.updateConfig({ cssPrefix: 'custom' });
      const config = colorGenerator.getConfig();

      expect(config.cssPrefix).toBe('custom');
    });

    it('应该提供性能指标', () => {
      colorGenerator.generate('#1890ff');
      const metrics = colorGenerator.getPerformanceMetrics();

      expect(metrics.totalTime).toBeGreaterThanOrEqual(0);
      expect(metrics.semanticColorGeneration).toBeGreaterThanOrEqual(0);
      expect(metrics.paletteGeneration).toBeGreaterThanOrEqual(0);
      expect(metrics.cssVariableGeneration).toBeGreaterThanOrEqual(0);
    });
  });
});
