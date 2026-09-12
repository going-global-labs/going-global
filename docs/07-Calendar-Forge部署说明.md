# Calendar Forge 部署说明

## 当前产物

- 网站入口：[apps/calendar-forge/index.html](/Users/jackmac/Users/jackmac/IDEA_CODE/going-global/apps/calendar-forge/index.html)
- 搜索引擎抓取规则：[apps/calendar-forge/robots.txt](/Users/jackmac/Users/jackmac/IDEA_CODE/going-global/apps/calendar-forge/robots.txt)
- 站点地图：[apps/calendar-forge/sitemap.xml](/Users/jackmac/Users/jackmac/IDEA_CODE/going-global/apps/calendar-forge/sitemap.xml)

## 本地预览

在项目根目录运行：

```bash
python3 -m http.server 4173 --directory apps/calendar-forge
```

浏览器打开 `http://localhost:4173`。

## 发布到海外

这是静态 HTML/CSS/JavaScript 站点，适合部署到 Cloudflare Pages、Netlify、Vercel Static 或 GitHub Pages。发布时：

1. 将 `apps/calendar-forge` 作为发布目录；
2. 域名使用 `calendarforge.stream`，目录中已经配置 `CNAME`、canonical、robots 和 sitemap；
3. 开启 HTTPS；
4. 在 Google Search Console 验证域名并提交真实域名下的 `sitemap.xml`；
5. 在目标国家 Google Trends 和 Search Console 数据出现后，再扩展月份、地区和长尾页面。

Google 不提供普通网站的免费托管入口，因此“发布到 Google 海外站”实际需要完成“部署到海外托管 + 提交 Google 收录”两步。当前页面已经具备可抓取的 HTML 标题、描述、Open Graph、robots 和 sitemap 基础。

## 上线前必做

- 将页面中的联系邮箱替换为真实运营邮箱；
- 复核各地区节假日数据并标注来源；
- 将当前文本下载升级为真实 PDF/ICS 导出；
- 接入隐私政策、Cookie 说明和分析工具时确认当地要求；
- 不使用竞品 Logo、截图、受版权保护模板或“官方”措辞；
- 用 Google Search Console 检查移动端、结构化数据和抓取状态。
