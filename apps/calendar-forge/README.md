# Calendar Forge

## 当前状态

- 状态：`live`
- 生产域名：`https://calendarforge.stream`
- 部署平台：GitHub Pages
- 发布目录：本目录 `apps/calendar-forge/`
- 部署工作流：`../../.github/workflows/deploy-calendar-forge.yml`
- 核心动作：用户生成、打印或下载月历

## 文件边界

```text
apps/calendar-forge/
├── index.html     # 当前静态 MVP
├── CNAME         # GitHub Pages 自定义域名
├── robots.txt    # 只服务 Calendar Forge
├── sitemap.xml   # 只服务 Calendar Forge
└── _headers      # Netlify/兼容平台的响应头配置
```

## 本地运行

```bash
python3 -m http.server 4173 --directory apps/calendar-forge
```

## 发布规则

- 只有修改本目录或对应 workflow 时才触发 Calendar Forge 部署；
- 其他 `apps/` 的修改不会更新生产站点；
- 修改节假日、域名、SEO 或下载逻辑前，先运行根目录的 `npm run validate`；
- 正式接入后台或数据库时，不要继续把逻辑堆入 `index.html`，应拆出 `apps/calendar-forge/web`、`apps/calendar-forge/api` 或独立服务。

## 上线前待办

- [ ] 核验所有地区节假日数据并记录来源；
- [ ] 把当前文本下载升级为 PDF/ICS 导出；
- [ ] 添加真实隐私政策、使用条款和运营邮箱；
- [x] 在 GitHub Pages 中绑定并验证 `calendarforge.stream`；
- [ ] 在 Google Search Console 验证域名并提交 `https://calendarforge.stream/sitemap.xml`。
