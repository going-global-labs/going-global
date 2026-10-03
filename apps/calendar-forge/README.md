# Calendar Forge

## 当前状态

- 状态：`live`
- 生产域名：`https://calendarforge.stream`
- 部署平台：GitHub Pages
- 发布目录：本目录 `apps/calendar-forge/`
- 部署工作流：`../../.github/workflows/deploy-calendar-forge.yml`
- 核心动作：用户选择模板、生成、打印、直接下载 PDF 或下载 Word 月历

## 文件边界

```text
apps/calendar-forge/
├── index.html     # 当前静态 MVP
├── seo-pages.css  # 年份和月份 SEO 页面样式
├── 2026-*/        # 构建生成的 2026 HTML 资源页
├── 2027-*/        # 构建生成的 2027 HTML 资源页
├── *-2026-calendar/ # 构建生成的月份页
├── *-2027-calendar/ # 构建生成的月份页
├── downloads/     # 构建生成的稳定 PDF 下载资源
├── CNAME         # GitHub Pages 自定义域名
├── robots.txt    # 只服务 Calendar Forge
├── sitemap.xml   # 只服务 Calendar Forge
└── _headers      # Netlify/兼容平台的响应头配置
```

## 本地运行

```bash
node ../../scripts/generate-calendar-seo-pages.mjs
python3 -m http.server 4173 --directory apps/calendar-forge
```

也可以在仓库根目录运行 `npm run build:calendar-forge`。生成器会创建 2026/2027 年份页、月份页、站点地图和 A4/US Letter PDF 文件。页面源码中的生成器是唯一维护入口，不要手工编辑生成的 SEO 页面。

## 发布规则

- 只有修改本目录或对应 workflow 时才触发 Calendar Forge 部署；
- 其他 `apps/` 的修改不会更新生产站点；
- 修改节假日、域名、SEO 或下载逻辑前，先运行根目录的 `npm run validate`；
- 修改 `scripts/generate-calendar-seo-pages.mjs` 后，先运行 `npm run build:calendar-forge`，再运行 `npm run validate`；
- 正式接入后台或数据库时，不要继续把逻辑堆入 `index.html`，应拆出 `apps/calendar-forge/web`、`apps/calendar-forge/api` 或独立服务。

## 上线前待办

- [ ] 核验所有地区节假日数据并记录来源；
- [x] 支持打印、直接下载 PDF，以及 Word 文档下载；
- [x] 提供 Classic、Editorial、Color Pop 和 Notes 四种月历模板，并同步到 PDF / Word 导出；
- [ ] 后续评估真正的 `.docx` 与 ICS 导出；
- [ ] 添加真实隐私政策、使用条款和运营邮箱；
- [x] 在 GitHub Pages 中绑定并验证 `calendarforge.stream`；
- [ ] 在 Google Search Console 验证域名并提交 `https://calendarforge.stream/sitemap.xml`。
