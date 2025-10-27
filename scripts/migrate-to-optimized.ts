#!/usr/bin/env node
/**
 * 迁移脚本：自动从原版迁移到优化版
 * 
 * 使用方法：
 * npx ts-node scripts/migrate-to-optimized.ts src/**/*.ts
  */

import fs from 'fs'
import path from 'path'
import glob from 'glob'

interface MigrationResult {
  file: string
  changes: number
  warnings: string[]
}

class ColorOptimizationMigrator {
  private results: MigrationResult[] = []

  /**
   * 执行迁移
   */
  async migrate(patterns: string[]): Promise<void> {
    console.log('🔄 开始迁移到优化版本...\n')

    // 获取所有需要迁移的文件
    const files = this.getFiles(patterns)

    if (files.length === 0) {
      console.log('❌ 未找到需要迁移的文件')
      return
    }

    console.log(`找到 ${files.length} 个文件需要处理\n`)

    // 处理每个文件
    for (const file of files) {
      await this.migrateFile(file)
    }

    // 打印总结
    this.printSummary()
  }

  /**
   * 获取匹配的文件列表
   */
  private getFiles(patterns: string[]): string[] {
    const files = new Set<string>()

    for (const pattern of patterns) {
      const matches = glob.sync(pattern, {
        nodir: true,
        absolute: true,
      })
      matches.forEach(file => files.add(file))
    }

    return Array.from(files).filter(file =>
      file.endsWith('.ts') ||
      file.endsWith('.tsx') ||
      file.endsWith('.js') ||
      file.endsWith('.jsx')
    )
  }

  /**
   * 迁移单个文件
   */
  private async migrateFile(filePath: string): Promise<void> {
    console.log(`处理: ${path.basename(filePath)}`)

    let content = fs.readFileSync(filePath, 'utf-8')
    const originalContent = content
    const warnings: string[] = []
    let changes = 0

    // 1. 更新导入路径
    content = content.replace(
      /from\s+['"]@ldesign\/color['"]/g,
      `from '@ldesign/color/optimized'`
    )
    if (content !== originalContent) {
      changes++
    }

    // 2. 查找 Color 对象创建但未释放的情况
    const colorCreations = content.match(/new\s+Color\s*\([^)]*\)/g) || []
    const colorFromMethods = content.match(/Color\.(fromRGB|fromHSL|fromHSV|random)\s*\([^)]*\)/g) || []
    const disposeCallsCount = (content.match(/\.dispose\(\)/g) || []).length

    const totalCreations = colorCreations.length + colorFromMethods.length
    if (totalCreations > disposeCallsCount) {
      warnings.push(
        `⚠️  发现 ${totalCreations} 个 Color 对象创建，但只有 ${disposeCallsCount} 个 dispose() 调用`
      )

      // 尝试自动添加 dispose() - 仅在简单情况下
      content = this.addDisposeCallsSimple(content)
      changes += totalCreations - disposeCallsCount
    }

    // 3. 更新批量操作接口
    content = content.replace(
      /batchManipulate\s*\([^,]+,\s*\[[\s\S]*?{\s*type:\s*['"](\w+)['"]\s*,\s*amount:\s*([^}]+)\s*}\s*\]/g,
      (match, type, amount) => {
        changes++
        return `batchManipulate($1, { type: '${type}', value: ${amount} }`
      }
    )

    // 4. 检查循环中的 Color 创建
    const forLoops = content.match(/for\s*\([^)]*\)\s*{[\s\S]*?new\s+Color[\s\S]*?}/g) || []
    const whileLoops = content.match(/while\s*\([^)]*\)\s*{[\s\S]*?new\s+Color[\s\S]*?}/g) || []
    const mapCalls = content.match(/\.map\s*\([^)]*=>\s*{?[\s\S]*?new\s+Color[\s\S]*?}\s*\)/g) || []

    if (forLoops.length + whileLoops.length + mapCalls.length > 0) {
      warnings.push(
        `⚠️  在循环中发现 Color 对象创建，建议使用批量处理函数`
      )
    }

    // 5. 保存文件（如果有改动）
    if (content !== originalContent) {
      // 创建备份
      fs.writeFileSync(`${filePath}.backup`, originalContent)
      // 写入新内容
      fs.writeFileSync(filePath, content)

      console.log(`  ✅ 已更新 (${changes} 处改动)`)
    } else {
      console.log(`  ⏭️  无需修改`)
    }

    this.results.push({
      file: filePath,
      changes,
      warnings,
    })
  }

  /**
   * 简单场景下自动添加 dispose()
   */
  private addDisposeCallsSimple(content: string): string {
    // 场景1: const color = new Color(...) 后面没有 dispose
    content = content.replace(
      /(const|let)\s+(\w+)\s*=\s*new\s+Color\s*\([^)]*\)\s*\n(?![\s\S]*?\2\.dispose\(\))/g,
      (match, varType, varName) => {
        // 查找变量的作用域结束位置
        const pattern = new RegExp(`${match}([\\s\\S]*?)(?=\\n\\s*}|\\n\\s*return|\\n\\s*const|\\n\\s*let|$)`)
        return content.replace(pattern, (fullMatch, codeBlock) => {
          return `${match}${codeBlock}\n  ${varName}.dispose()`
        })
      }
    )

    return content
  }

  /**
   * 打印迁移总结
   */
  private printSummary(): void {
    console.log('\n' + '='.repeat(50))
    console.log('📊 迁移总结\n')

    const totalFiles = this.results.length
    const modifiedFiles = this.results.filter(r => r.changes > 0).length
    const totalChanges = this.results.reduce((sum, r) => sum + r.changes, 0)
    const filesWithWarnings = this.results.filter(r => r.warnings.length > 0)

    console.log(`✅ 处理文件: ${totalFiles}`)
    console.log(`📝 修改文件: ${modifiedFiles}`)
    console.log(`🔧 总计改动: ${totalChanges}`)

    if (filesWithWarnings.length > 0) {
      console.log(`\n⚠️  需要手动检查的文件 (${filesWithWarnings.length}):\n`)

      for (const result of filesWithWarnings) {
        console.log(`  ${path.basename(result.file)}:`)
        for (const warning of result.warnings) {
          console.log(`    ${warning}`)
        }
      }
    }

    console.log('\n💡 建议:')
    console.log('  1. 检查所有 Color 对象是否正确调用了 dispose()')
    console.log('  2. 将循环中的颜色处理改为批量函数')
    console.log('  3. 运行测试确保功能正常')
    console.log('  4. 备份文件已创建 (*.backup)')
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('使用方法:')
    console.log('  npx ts-node scripts/migrate-to-optimized.ts <文件模式>')
    console.log('  例如: npx ts-node scripts/migrate-to-optimized.ts src/**/*.ts')
    process.exit(1)
  }

  const migrator = new ColorOptimizationMigrator()
  await migrator.migrate(args)
}

// 运行
if (require.main === module) {
  main().catch(console.error)
}

export { ColorOptimizationMigrator }
