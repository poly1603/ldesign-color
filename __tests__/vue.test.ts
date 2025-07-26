import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import {
  ColorPalette,
  ColorPicker,
  ColorProvider,
  ThemePreview
} from '../src/vue/ColorProvider';
import {
  useBatchColor,
  useColor,
  useHighPerformanceColor,
  useSimpleColor,
  useThemeSwitch
} from '../src/vue/useColor';

describe('Vue组合式API测试', () => {
  describe('useColor', () => {
    it('应该正确初始化', () => {
      const primaryColor = ref('#1890ff');
      const { theme, loading, error, isValid } = useColor(primaryColor);

      expect(theme.value).toBeNull();
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
      expect(isValid.value).toBe(true);
    });

    it('应该响应颜色变化', async () => {
      const primaryColor = ref('#1890ff');
      const { theme, generateTheme } = useColor(primaryColor, {
        autoInject: false,
        useWebWorker: false
      });

      await generateTheme();
      expect(theme.value).toBeDefined();
      expect(theme.value?.semanticColors.primary).toBe('#1890ff');

      // 改变颜色
      primaryColor.value = '#52c41a';
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待异步生成

      expect(theme.value?.semanticColors.primary).toBe('#52c41a');
    });

    it('应该处理无效颜色', () => {
      const primaryColor = ref('invalid-color');
      const { isValid } = useColor(primaryColor);

      expect(isValid.value).toBe(false);
    });

    it('应该提供性能指标', async () => {
      const primaryColor = ref('#1890ff');
      const { generateTheme, getPerformanceMetrics } = useColor(primaryColor, {
        useWebWorker: false
      });

      await generateTheme();
      const metrics = getPerformanceMetrics();

      expect(metrics.totalTime).toBeGreaterThanOrEqual(0);
      expect(metrics.semanticColorGeneration).toBeGreaterThanOrEqual(0);
      expect(metrics.paletteGeneration).toBeGreaterThanOrEqual(0);
      expect(metrics.cssVariableGeneration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('useSimpleColor', () => {
    it('应该提供简化的API', () => {
      const primaryColor = ref('#1890ff');
      const { theme, loading, error } = useSimpleColor(primaryColor);

      expect(theme.value).toBeNull();
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });
  });

  describe('useHighPerformanceColor', () => {
    it('应该启用高性能配置', () => {
      const primaryColor = ref('#1890ff');
      const { colorGenerator } = useHighPerformanceColor(primaryColor);

      const config = colorGenerator.getConfig();
      expect(config.enableCache).toBe(true);
      expect(config.cacheSize).toBeGreaterThan(100);
    });
  });

  describe('useBatchColor', () => {
    it('应该批量处理颜色', async () => {
      const colors = ref(['#1890ff', '#52c41a', '#f5222d']);
      const { themes, generateThemes } = useBatchColor(colors);

      await generateThemes();
      expect(themes.value).toHaveLength(3);
      themes.value.forEach((theme, index) => {
        expect(theme.semanticColors.primary).toBe(colors.value[index]);
      });
    });
  });

  describe('useThemeSwitch', () => {
    it('应该正确切换主题', () => {
      const { currentTheme, toggleTheme, isDark } = useThemeSwitch();

      const initialTheme = currentTheme.value;
      toggleTheme();

      expect(currentTheme.value).not.toBe(initialTheme);
      expect(isDark.value).toBe(currentTheme.value === 'dark');
    });

    it('应该正确设置主题', () => {
      const { currentTheme, setTheme } = useThemeSwitch();

      setTheme('dark');
      expect(currentTheme.value).toBe('dark');

      setTheme('light');
      expect(currentTheme.value).toBe('light');
    });
  });
});

describe('Vue组件测试', () => {
  describe('ColorProvider', () => {
    it('应该正确渲染', () => {
      const wrapper = mount(ColorProvider, {
        props: {
          primaryColor: '#1890ff'
        },
        slots: {
          default: '<div>子组件内容</div>'
        }
      });

      expect(wrapper.find('.ldesign-color-provider').exists()).toBe(true);
      expect(wrapper.text()).toContain('子组件内容');
    });

    it('应该显示加载状态', async () => {
      const wrapper = mount(ColorProvider, {
        props: {
          primaryColor: '#1890ff',
          showLoading: true,
          loadingText: '自定义加载文本'
        }
      });

      // 模拟加载状态
      await wrapper.vm.$nextTick();

      // 注意：实际的加载状态可能需要更复杂的模拟
      expect(wrapper.props('loadingText')).toBe('自定义加载文本');
    });

    it('应该处理配置属性', () => {
      const config = {
        enableCache: false,
        useWebWorker: false
      };

      const wrapper = mount(ColorProvider, {
        props: {
          primaryColor: '#1890ff',
          config
        }
      });

      expect(wrapper.props('config')).toEqual(config);
    });
  });

  describe('ColorPicker', () => {
    it('应该正确渲染', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#1890ff'
        }
      });

      expect(wrapper.find('.ldesign-color-picker').exists()).toBe(true);
      expect(wrapper.find('input[type="color"]').exists()).toBe(true);
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('应该响应颜色变化', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#1890ff'
        }
      });

      const colorInput = wrapper.find('input[type="color"]');
      await colorInput.setValue('#ff0000');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('应该显示预设颜色', () => {
      const presetColors = ['#1890ff', '#52c41a', '#f5222d'];
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#1890ff',
          presetColors,
          showPresets: true
        }
      });

      const presetItems = wrapper.findAll('.ldesign-color-picker__preset-item');
      expect(presetItems).toHaveLength(presetColors.length);
    });

    it('应该处理禁用状态', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#1890ff',
          disabled: true
        }
      });

      const inputs = wrapper.findAll('input');
      inputs.forEach(input => {
        expect(input.attributes('disabled')).toBeDefined();
      });
    });
  });

  describe('ColorPalette', () => {
    it('应该正确渲染色阶', () => {
      const colors = ['#e6f7ff', '#bae7ff', '#91d5ff', '#69c0ff', '#40a9ff'];
      const wrapper = mount(ColorPalette, {
        props: {
          colorName: 'primary',
          colors
        }
      });

      expect(wrapper.find('.ldesign-color-palette').exists()).toBe(true);
      expect(wrapper.find('.ldesign-color-palette__title').text()).toBe('primary');

      const colorItems = wrapper.findAll('.ldesign-color-palette__color-item');
      expect(colorItems).toHaveLength(colors.length);
    });

    it('应该显示颜色值', () => {
      const colors = ['#e6f7ff', '#bae7ff'];
      const wrapper = mount(ColorPalette, {
        props: {
          colorName: 'primary',
          colors,
          showValues: true
        }
      });

      const colorValues = wrapper.findAll('.ldesign-color-palette__color-value');
      expect(colorValues.length).toBeGreaterThan(0);
    });

    it('应该响应点击事件', async () => {
      const colors = ['#e6f7ff', '#bae7ff'];
      const wrapper = mount(ColorPalette, {
        props: {
          colorName: 'primary',
          colors,
          copyable: true
        }
      });

      const firstColorItem = wrapper.find('.ldesign-color-palette__color-item');
      await firstColorItem.trigger('click');

      expect(wrapper.emitted('colorClick')).toBeTruthy();
      const emittedEvent = wrapper.emitted('colorClick')?.[0]?.[0] as any;
      expect(emittedEvent.color).toBe(colors[0]);
      expect(emittedEvent.index).toBe(0);
    });
  });

  describe('ThemePreview', () => {
    it('应该显示空状态', () => {
      // 由于ThemePreview依赖于ColorProvider的上下文，
      // 这里需要模拟或者在ColorProvider内部测试
      const wrapper = mount(ThemePreview);

      // 在没有主题数据时应该显示空状态
      expect(wrapper.find('.ldesign-theme-preview__empty').exists()).toBe(true);
    });
  });
});

describe('组件集成测试', () => {
  it('ColorProvider和ThemePreview应该正确协作', async () => {
    const wrapper = mount({
      template: `
        <ColorProvider primary-color="#1890ff">
          <ThemePreview />
        </ColorProvider>
      `,
      components: {
        ColorProvider,
        ThemePreview
      }
    });

    expect(wrapper.find('.ldesign-color-provider').exists()).toBe(true);
    expect(wrapper.find('.ldesign-theme-preview').exists()).toBe(true);
  });

  it('ColorProvider和ColorPicker应该正确协作', () => {
    const wrapper = mount({
      template: `
        <ColorProvider primary-color="#1890ff">
          <ColorPicker v-model="color" />
        </ColorProvider>
      `,
      components: {
        ColorProvider,
        ColorPicker
      },
      data() {
        return {
          color: '#1890ff'
        };
      }
    });

    expect(wrapper.find('.ldesign-color-provider').exists()).toBe(true);
    expect(wrapper.find('.ldesign-color-picker').exists()).toBe(true);
  });
});
