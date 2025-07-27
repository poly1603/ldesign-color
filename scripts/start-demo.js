#!/usr/bin/env node

/**
 * 启动演示项目的脚本
 */

const { spawn } = require('node:child_process')
const path = require('node:path')

console.log('🎨 启动 @ldesign/color 演示项目...')

// 切换到示例目录
const examplesDir = path.join(__dirname, '../examples')

// 启动开发服务器
const child = spawn('pnpm', ['dev'], {
  cwd: examplesDir,
  stdio: 'inherit',
  shell: true,
})

child.on('error', (error) => {
  console.error('❌ 启动失败:', error)
  process.exit(1)
})

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ 进程退出，代码: ${code}`)
    process.exit(code)
  }
})

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭演示项目...')
  child.kill('SIGINT')
})

process.on('SIGTERM', () => {
  child.kill('SIGTERM')
})
