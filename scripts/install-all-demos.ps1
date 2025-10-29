#!/usr/bin/env pwsh
# 为所有演示项目安装依赖
# 使用方法: .\scripts\install-all-demos.ps1

Write-Host "📦 为所有演示项目安装依赖..." -ForegroundColor Green
Write-Host ""

$demos = @(
    "packages\core\examples\vite-demo",
    "packages\react\examples\vite-demo",
    "packages\vue\examples\vite-demo",
    "packages\svelte\examples\vite-demo",
    "packages\solid\examples\vite-demo"
)

$rootPath = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

foreach ($demoPath in $demos) {
    $fullPath = Join-Path $rootPath $demoPath
    $demoName = ($demoPath -split '\\')[1]
    
    if (Test-Path $fullPath) {
        Write-Host "📥 安装 $demoName 演示依赖..." -ForegroundColor Cyan
        Push-Location $fullPath
        
        try {
            pnpm install
            Write-Host "✅ $demoName 依赖安装完成" -ForegroundColor Green
        } catch {
            Write-Host "❌ $demoName 依赖安装失败: $_" -ForegroundColor Red
        }
        
        Pop-Location
        Write-Host ""
    } else {
        Write-Host "⚠️  找不到演示目录: $fullPath" -ForegroundColor Yellow
    }
}

Write-Host "🎉 所有演示项目依赖安装完成！" -ForegroundColor Green
Write-Host ""
Write-Host "💡 下一步: 运行 .\scripts\run-all-demos.ps1 启动所有演示" -ForegroundColor Yellow


