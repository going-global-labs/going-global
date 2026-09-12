# GitHub Pages 与 Cloudflare 配置记录

> 更新时间：2026-09-12
>
> 适用域名：`calendarforge.stream`
>
> 适用仓库：[going-global-labs/going-global](https://github.com/going-global-labs/going-global)

## 1. DNS 里的 4 个 IP 是什么

截图中的 4 条 A 记录是 GitHub Pages 为根域名提供的 4 个固定入口：

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

它们不是 4 个服务器让你任选其一，而是 GitHub Pages 的冗余地址。根域名 `calendarforge.stream` 应同时保留 4 条 A 记录，提升可用性。

截图里的 `www` CNAME：

```text
www.calendarforge.stream -> going-global-labs.github.io
```

表示访问 `www.calendarforge.stream` 时，转到 GitHub Pages 的组织地址。当前 GitHub Pages 主域名配置的是不带 `www` 的：

```text
calendarforge.stream
```

因此 `www.calendarforge.stream` 应最终跳转到 `calendarforge.stream`，不要把两个地址同时当成主站。

## 2. Cloudflare 橙色云是什么意思

橙色云表示 Cloudflare 代理已开启：

```text
访客 -> Cloudflare -> GitHub Pages
```

灰色云表示仅 DNS：

```text
访客 -> GitHub Pages
```

当前 GitHub Pages 正在申请和验证自定义域名证书。为了让 GitHub 能直接检查 DNS，建议临时把以下记录都切换为灰色云：

- `calendarforge.stream` 的 4 条 A 记录；
- `www.calendarforge.stream` 的 CNAME 记录。

切换方法：

1. 登录 Cloudflare；
2. 进入 `calendarforge.stream` 的 DNS 页面；
3. 点击每条记录右侧的橙色云；
4. 变成灰色云，即 `DNS only`；
5. 等待 DNS 缓存更新；
6. 回到 GitHub 仓库的 **Settings > Pages**，查看自定义域名状态。

在 GitHub 证书签发完成、HTTPS 正常后，是否重新开启 Cloudflare 代理取决于后续是否需要 Cloudflare 的缓存、WAF 或防护功能。当前静态站建议先保持灰云，链路最简单。

## 3. GitHub 设置已完成的内容

本次已通过 GitHub API 完成：

```text
仓库：going-global-labs/going-global
仓库可见性：Public
默认分支：main
Pages 构建方式：GitHub Actions
Pages 自定义域名：calendarforge.stream
Calendar Forge workflow：已启用
Validate workflow：已启用
Calendar Forge 部署：成功
```

对应工作流：

- `.github/workflows/deploy-calendar-forge.yml`：只发布 `apps/calendar-forge/`；
- `.github/workflows/validate.yml`：检查 5 个应用和部署边界。

Calendar Forge 的生产资源：

```text
应用目录：apps/calendar-forge/
CNAME：calendarforge.stream
robots：https://calendarforge.stream/sitemap.xml
sitemap：https://calendarforge.stream/
canonical：https://calendarforge.stream/
```

## 4. 当前状态

GitHub 当前状态：

```text
Pages：已启用
自定义域名：已配置
部署工作流：成功
DNS：已解析到 Cloudflare
GitHub HTTPS 证书：已签发并批准
Enforce HTTPS：已开启
```

GitHub API 当前已返回 `https_enforced: true`。证书由 Let's Encrypt 签发，覆盖 `calendarforge.stream` 和 `www.calendarforge.stream`。

验证命令：

```bash
node <<'NODE'
import dns from "node:dns/promises";
console.log("A:", await dns.resolve4("calendarforge.stream"));
console.log("AAAA:", await dns.resolve6("calendarforge.stream").catch(() => []));
NODE
```

证书已经生成，在 GitHub Pages 设置中已开启：

```text
Enforce HTTPS
```

最终验收：

```text
https://calendarforge.stream/
https://calendarforge.stream/robots.txt
https://calendarforge.stream/sitemap.xml
```

## 5. Google Search Console

HTTPS 正常后，再在 [Google Search Console](https://search.google.com/search-console) 中：

1. 添加 Domain 资源：`calendarforge.stream`；
2. 完成 DNS TXT 验证；
3. 打开 Sitemaps；
4. 提交 `https://calendarforge.stream/sitemap.xml`；
5. 使用 URL Inspection 检查 `https://calendarforge.stream/`；
6. 请求编入索引。

提交 sitemap 不保证立即收录或获得排名。应持续观察索引、查询词、展示、点击和移动端体验。

## 6. 当前需要人工完成的唯一动作

在 Cloudflare DNS 页面，把这 5 条 GitHub Pages 记录从橙色云切换成灰色云：

```text
calendarforge.stream   A       185.199.108.153   DNS only
calendarforge.stream   A       185.199.109.153   DNS only
calendarforge.stream   A       185.199.110.153   DNS only
calendarforge.stream   A       185.199.111.153   DNS only
www                    CNAME   going-global-labs.github.io   DNS only
```

已确认 GitHub 证书状态可用并开启 `Enforce HTTPS`。后续不需要修改代码，也不需要重新创建仓库或 Pages 项目。
