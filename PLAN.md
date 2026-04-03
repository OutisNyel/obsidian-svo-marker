# 主谓宾标记插件实施计划（class 化 + 执行版）

## 摘要
把当前“内联 style 包裹”方案升级为“`styles.css` 类名驱动”，统一输出简洁标签结构；同步更新 `PLAN.md` 为最终实施说明；随后按计划实现并验证插件功能。

## 关键变更
- 标记输出从内联样式改为类名：
  - 输出结构：`<span class="svo-subj">...</span>` / `svo-pred` / `svo-obj`
  - 样式落在 `styles.css`，不再在文本里写 `style=""`
- 命令显示名简化为：
  - `标记主`
  - `标记谓`
  - `标记宾`
- 稳定命令 ID（后续不改名）：
  - `mark-svo-subj`
  - `mark-svo-pred`
  - `mark-svo-obj`
- 兼容策略（已锁定）：
  - 执行命令时自动识别旧内联主/谓/宾标记，并迁移为对应 class 标记
  - 同类重复执行保持幂等，不产生重复嵌套
  - 不同类别切换时，仅保留最新一层标记

## 实施步骤
1. 更新 `PLAN.md`，写入本计划的最终版内容（替换旧草案）。
2. 精简插件入口：
   - 清理 sample 模板遗留功能（modal/ribbon/status bar/全局监听/interval/示例设置项）。
   - `main.ts` 仅保留生命周期与 3 个命令注册。
3. 新增标记逻辑模块（`src/marking.ts`）：
   - 统一处理“选区检查、旧标记识别、迁移、幂等、替换回写”。
4. 更新 `styles.css`：
   - `.svo-subj { text-decoration: underline line-through; }`
   - `.svo-pred { text-decoration: underline; }`
   - `.svo-obj { text-decoration: underline wavy; }`
5. 构建与验证：
   - 运行 `npm run lint`、`npm run build`
   - 手动验证命令可见性、空选区提示、幂等、旧样式迁移、跨行标记

## 测试与验收
- 功能验收：
  - 选中文本执行 3 个命令，生成对应 class 标签并正确渲染
  - 对旧内联标记文本执行命令后，输出转换为 class 方案
  - 同类重复执行无重复包裹；类别切换后仅保留目标类别
  - 无活动编辑器或空选区时不改文档，仅提示
- 工程验收：
  - `npm run lint` 通过
  - `npm run build` 通过
  - 插件启停无报错、无遗留监听/定时器

## 假设与默认
- v1 仅做手动标记，不做自动 NLP 识别。
- 不绑定默认快捷键，由用户在 Obsidian 内自定义。
- 保持离线本地能力，不引入网络请求。
