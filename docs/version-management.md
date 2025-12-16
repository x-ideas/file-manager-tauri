# Version Management

本项目使用统一的版本管理策略，版本号存储在 `package.json` 中，并自动同步到其他配置文件。

## 版本文件

- `package.json` - 主版本源（source of truth）
- `src-tauri/tauri.conf.json` - Tauri 配置文件
- `src-tauri/Cargo.toml` - Rust Cargo 配置

## 使用方法

### 同步版本号

如果手动修改了 `package.json` 中的版本号，运行以下命令同步到其他文件：

```bash
pnpm version:sync
```

### 更新版本号

#### Patch 版本（修复 bug）
```bash
pnpm version:patch
# 例如: 0.1.0 -> 0.1.1
```

#### Minor 版本（新功能）
```bash
pnpm version:minor
# 例如: 0.1.0 -> 0.2.0
```

#### Major 版本（重大变更）
```bash
pnpm version:major
# 例如: 0.1.0 -> 1.0.0
```

#### 设置特定版本号
```bash
pnpm version:set 1.2.3
```

## 工作流程

1. 使用 `pnpm version:*` 命令更新版本号
2. 脚本会自动：
   - 更新 `package.json` 中的版本号
   - 同步到 `tauri.conf.json`
   - 同步到 `Cargo.toml`
3. 提交更改到 Git
4. 推送到 `release` 分支触发构建和发布

## 注意事项

- 始终使用 `pnpm version:*` 命令来更新版本号，不要手动修改单个文件
- 版本号遵循 [Semantic Versioning](https://semver.org/) 规范
- 在发布前确保所有版本号已同步
