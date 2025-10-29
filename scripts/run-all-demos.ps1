#!/usr/bin/env pwsh
# 启动所有演示项目
# 使用方法: .\scripts\run-all-demos.ps1

Write-Host "🚀 启动所有 @ldesign/color 演示项目..." -ForegroundColor Green
Write-Host ""

$demos = @(
    @{ Name = "Core (Vanilla TS)"; Path = "packages\core\examples\vite-demo"; Port = 3000 }
    @{ Name = "React"; Path = "packages\react\examples\vite-demo"; Port = 3001 }
    @{ Name = "Vue"; Path = "packages\vue\examples\vite-demo"; Port = 3002 }
    @{ Name = "Svelte"; Path = "packages\svelte\examples\vite-demo"; Port = 3003 }
    @{ Name = "Solid.js"; Path = "packages\solid\examples\vite-demo"; Port = 3004 }
)

foreach ($demo in $demos) {
    $fullPath = Join-Path $PSScriptRoot ".." $demo.Path
    
    if (Test-Path $fullPath) {
        Write-Host "✨ 启动 $($demo.Name) 演示 (端口 $($demo.Port))..." -ForegroundColor Cyan
        Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; pnpm dev" -WindowStyle Normal
        Start-Sleep -Seconds 1
    } else {
        Write-Host "⚠️  找不到 $($demo.Name) 演示目录: $fullPath" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ 所有演示项目已启动！" -ForegroundColor Green
Write-Host ""
Write-Host "📌 访问地址:" -ForegroundColor Yellow
Write-Host "   Core:     http://localhost:3000"
Write-Host "   React:    http://localhost:3001"
Write-Host "   Vue:      http://localhost:3002"
Write-Host "   Svelte:   http://localhost:3003"
Write-Host "   Solid.js: http://localhost:3004"
Write-Host ""
Write-Host "💡 提示: 每个演示在独立的终端窗口中运行" -ForegroundColor Gray
Write-Host "   关闭终端窗口即可停止对应的演示项目" -ForegroundColor Gray


