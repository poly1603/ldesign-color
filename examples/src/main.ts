import { createApp } from 'vue'
import SimpleColorDemo from './SimpleColorDemo.vue'

// 引入样式
import './styles/index.css'

// 创建应用实例
const app = createApp(SimpleColorDemo)

// 挂载应用
app.mount('#app')

// 开发环境下的调试信息
if (import.meta.env.DEV) {
  console.log('🎨 @ldesign/color 演示应用已启动')
  console.log('📖 查看文档: https://ldesign.github.io/color/')
  console.log('🐛 报告问题: https://github.com/ldesign/color/issues')
}
