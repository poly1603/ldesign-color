# 脚本工具

本目录包含用于管理 @ldesign/color 演示项目的便捷脚本。

## 📜 可用脚本

### 1. install-all-demos.ps1

为所有演示项目安装依赖。

**使用方法**:
```powershell
.\scripts\install-all-demos.ps1
```

**功能**:
- 自动遍历所有演示目录
- 在每个目录执行 `pnpm install`
- 显示安装进度和结果

---

### 2. run-all-demos.ps1

同时启动所有演示项目。

**使用方法**:
```powershell
.\scripts\run-all-demos.ps1
```

**功能**:
- 在独立终端窗口启动每个演示
- 自动分配端口（3000-3004）
- 显示访问地址

**演示端口**:
- Core: 3000
- React: 3001
- Vue: 3002
- Svelte: 3003
- Solid.js: 3004

---

## 🚀 快速开始

### 首次使用

```powershell
# 1. 安装所有演示的依赖
.\scripts\install-all-demos.ps1

# 2. 启动所有演示
.\scripts\run-all-demos.ps1
```

### 日常使用

```powershell
# 直接启动（依赖已安装）
.\scripts\run-all-demos.ps1
```

---

## 💡 使用技巧

### 只启动特定演示

如果只想启动某个演示，直接进入对应目录：

```bash
cd packages/react/examples/vite-demo
pnpm dev
```

### 停止演示

每个演示在独立的终端窗口运行，直接关闭对应窗口即可停止。

### 重新安装依赖

如果依赖有问题，可以：

```bash
cd packages/[package]/examples/vite-demo
rm -rf node_modules
pnpm install
```

或运行：

```powershell
.\scripts\install-all-demos.ps1
```

---

## 🔧 脚本说明

### PowerShell 脚本特点

- ✅ Windows 友好
- ✅ 彩色输出
- ✅ 错误处理
- ✅ 进度显示
- ✅ 自动化执行

### 跨平台支持

如果你使用 macOS/Linux，可以使用以下命令：

```bash
# 安装依赖
for dir in packages/*/examples/vite-demo; do
  (cd "$dir" && pnpm install)
done

# 启动演示（后台运行）
cd packages/core/examples/vite-demo && pnpm dev &
cd packages/react/examples/vite-demo && pnpm dev &
cd packages/vue/examples/vite-demo && pnpm dev &
cd packages/svelte/examples/vite-demo && pnpm dev &
cd packages/solid/examples/vite-demo && pnpm dev &
```

---

## 📝 添加新脚本

欢迎添加更多便捷脚本，例如：

- `build-all-demos.ps1` - 构建所有演示
- `clean-all-demos.ps1` - 清理所有演示的构建产物
- `test-all-demos.ps1` - 测试所有演示

---

## 🎯 最佳实践

1. **首次使用前** - 运行 `install-all-demos.ps1`
2. **日常开发** - 直接进入对应演示目录
3. **展示对比** - 运行 `run-all-demos.ps1`
4. **遇到问题** - 重新安装依赖

---

**祝你使用愉快！** 🎨


