# Calendar Forge 海外发布与 Google 收录操作指引

> 适用项目：`Calendar Forge` 静态网站
>
> 当前生产应用目录：`apps/calendar-forge/`
>
> 本文说明如何把网站发布到海外静态托管平台，并提交 Google Search Console。本文不代替域名、托管、隐私、广告或当地法律咨询。

## 1. 先理解发布链路

Google 不提供普通网站的“海外托管入口”。网站上线需要经过两条链路：

```text
本地某个 app 目录
  -> 该 app 的独立部署项目
  -> 自有域名 + HTTPS
  -> Google Search Console 验证
  -> 提交 sitemap
  -> Google 抓取、收录和排名观察
```

托管平台负责让网页能被访问，Google Search Console 负责告诉 Google 网站存在并提供抓取诊断。提交 sitemap 不等于保证收录或排名。

## 2. 当前工程结构

```text
apps/
├── calendar-forge/          # 当前生产候选，绑定 calendarforge.stream
│   ├── index.html
│   ├── CNAME
│   ├── robots.txt
│   └── sitemap.xml
├── stackwise/               # 实验应用，不跟随 Calendar Forge 部署
├── switchboard/
├── costume-cartographer/
└── matchday-clock/

config/sites.json            # 站点清单、状态、域名和核心指标
.github/workflows/           # 每个生产站点使用独立工作流
scripts/validate-sites.mjs   # 目录、域名和工作流校验
```

本地预览：

```bash
cd /Users/jackmac/Users/jackmac/IDEA_CODE/going-global
python3 -m http.server 4173 --directory apps/calendar-forge
```

然后打开：`http://localhost:4173`

## 3. 发布前检查

### 3.1 替换示例信息

当前文件里使用了示例域名和邮箱，正式发布前必须替换：

- `apps/calendar-forge/robots.txt` 中的 sitemap；
- `apps/calendar-forge/sitemap.xml` 中的真实域名；
- `apps/calendar-forge/index.html` 中的真实运营邮箱；
- `apps/calendar-forge/CNAME` 中的 `calendarforge.stream`。

假设正式域名是 `https://your-domain.com`，可以执行：

```bash
cd /Users/jackmac/Users/jackmac/IDEA_CODE/going-global
sed -i '' 's#hello@calendarforge.stream#your-real-email@example.com#g' apps/calendar-forge/index.html
```

如果使用的不是 macOS，请使用对应系统的文本替换命令，或直接在编辑器中替换。

### 3.2 浏览器验收

检查以下内容：

- 首页能打开，标题是 `Calendar Forge | Print a better month`；
- 修改月份、年份、地区后，日历会更新；
- 勾选或取消 `Show public holidays` 后，节假日显示状态变化；
- `Print preview` 能打开系统打印预览；
- `Download` 能生成下载文件；
- 手机宽度下没有横向滚动和文字遮挡；
- 页面没有使用竞品 Logo、图片、文案或“官方”措辞。

### 3.3 数据验收

节假日数据必须在上线前逐地区复核。当前页面里的节假日是 MVP 示例，不应在没有核验来源的情况下宣传为完整法定节假日数据库。建议为每个地区记录：

```text
地区：
数据来源：
最后核验时间：
核验人：
适用范围和例外：
```

## 4. 选择托管平台

四个平台都可以部署本项目。小团队优先选择 Cloudflare Pages 或 Netlify；已经使用 Vercel 或 GitHub 的团队可以选择对应平台。

| 平台 | 适合场景 | 发布目录 | 备注 |
| --- | --- | --- | --- |
| Cloudflare Pages | 静态站、全球 CDN、域名和 DNS 在 Cloudflare | `site` | 可用网页操作，也可用 Wrangler |
| Netlify | 静态站、拖拽发布、表单和预览部署 | `site` | 新手操作简单 |
| Vercel | 已有 Vercel 项目或后续接入框架 | `site` | 静态 HTML 可以直接发布 |
| GitHub Pages | 代码放在 GitHub，希望免费托管 | `site` 或发布分支 | 需要处理项目路径和自定义域名 |

一次只选一个平台。不要为了“海外”同时部署多个生产站点，否则会产生重复 URL、canonical 和数据统计问题。

## 5. Cloudflare Pages 发布步骤

### 5.1 网页操作方式

1. 登录 Cloudflare 控制台并进入 **Workers & Pages**。
2. 选择 **Create application**，再选择 **Pages**。
3. 选择 **Upload assets**，创建一个 Pages 项目。
4. 将本地 `apps/calendar-forge/` 目录中的文件上传，或连接 Git 仓库并将输出目录设置为该目录。
5. 完成后打开 Cloudflare 分配的 `pages.dev` 地址。
6. 检查首页、日历切换、打印、下载和移动端布局。

### 5.2 连接 Git 仓库方式

如果工程以后放到 Git 仓库：

1. 在 Cloudflare Pages 中选择连接 Git 提供商。
2. 选择本项目仓库。
3. 构建命令留空，或填写不会破坏静态文件的命令。
4. 输出目录填写 `site`。
5. 保存并触发部署。

当前项目没有可用的 Git 仓库，因此首次发布建议使用直接上传，或者先把项目放入你自己的 Git 仓库。

### 5.3 绑定域名

1. 在 Pages 项目中打开 **Custom domains**。
2. 添加自己的域名，例如 `calendarforge.com`。
3. 如果 DNS 在 Cloudflare，按控制台提示添加记录。
4. 等待证书签发完成。
5. 用 `https://your-domain.com` 访问，不要把 `pages.dev` 地址作为最终宣传地址。

## 6. Netlify 发布步骤

1. 登录 Netlify，进入 **Add new site**。
2. 选择 **Deploy manually**。
3. 将本地 `apps/calendar-forge/` 目录拖入上传区域。
4. 打开 Netlify 分配的预览地址进行验收。
5. 进入 **Domain management**，添加自有域名。
6. 按 DNS 提示配置域名。
7. 确认 HTTPS 证书状态正常。

Netlify 支持使用 `apps/calendar-forge/_headers` 设置部分响应头。其他平台可能忽略这个文件，不影响基本页面运行。

## 7. Vercel 发布步骤

### 7.1 网页方式

1. 登录 Vercel，选择 **Add New Project**。
2. 导入 Git 仓库，或使用 Vercel 支持的静态项目方式。
3. Framework Preset 选择 `Other`，构建命令留空。
4. Output Directory 填写 `apps/calendar-forge`。
5. 部署后打开预览地址验收。
6. 在项目设置中添加自有域名并按要求配置 DNS。

### 7.2 CLI 方式

在确认已经安装并登录 Vercel CLI 后，可以在某个应用目录运行。当前生产候选是 `apps/calendar-forge/`：

```bash
cd /Users/jackmac/Users/jackmac/IDEA_CODE/going-global/apps/calendar-forge
npx vercel .
npx vercel --prod .
```

CLI 发布前先运行 `npx vercel --help` 确认当前 CLI 版本的参数。不要把账号 Token 写入代码或提交到仓库。

## 8. GitHub Pages 发布步骤

本项目已经提供 Calendar Forge 专用工作流：`.github/workflows/deploy-calendar-forge.yml`。它只把 `apps/calendar-forge/` 发布到 GitHub Pages，并且只在 Calendar Forge 目录发生变化时触发。

### 8.1 第一次发布

1. 在 `going-global-labs` 组织创建仓库 `going-global`。
2. 不要在创建页面自动添加 README、`.gitignore` 或 License，避免第一次推送产生冲突。
3. 在项目根目录执行：

```bash
cd /Users/jackmac/Users/jackmac/IDEA_CODE/going-global
git init
git add .
git commit -m "Initial static site experiments"
git branch -M main
git remote add origin https://github.com/going-global-labs/going-global.git
git push -u origin main
```

第一次 `git push` 可能会要求浏览器登录或 Personal Access Token，不能把密码写入命令。

### 8.2 开启 GitHub Pages

1. 打开 GitHub 仓库的 **Settings**。
2. 打开左侧 **Pages**。
3. 在 **Build and deployment** 的 **Source** 中选择 **GitHub Actions**。
4. 打开 **Actions** 页面，等待 `Deploy Calendar Forge` 执行成功。
5. 在 **Settings > Pages** 里确认 GitHub Pages 已启用，并打开 GitHub 显示的诊断地址。正式访问地址是 `https://calendarforge.stream/`。

### 8.3 Calendar Forge 的访问地址

Calendar Forge 使用独立的 GitHub Pages workflow，不把其他实验应用发布到同一个生产站点。仓库地址是：

```text
https://going-global-labs.github.io/going-global/
```

正式生产地址是 `https://calendarforge.stream/`。GitHub Pages 是静态托管，不需要 Node、数据库或服务器进程。组织 Pages 的默认地址仅用于部署诊断和备用访问。

### 8.4 GitHub Pages 的注意事项

- 每个站点目录必须保留自己的 `index.html`；
- 每次推送到 `main` 都会触发重新部署；
- 页面内使用相对路径，因此放在仓库子路径下也能正常打开；
- `apps/calendar-forge/CNAME` 已配置 `calendarforge.stream`；
- `apps/calendar-forge/sitemap.xml` 和 `robots.txt` 已使用生产域名；
- `_headers` 是 Netlify/部分平台使用的配置，GitHub Pages 不会应用它；
- 自定义域名可以在 **Settings > Pages > Custom domain** 中配置，HTTPS 开关也在该页面确认。

### 8.5 生产域名下的 sitemap

当前生产 URL 是：

```text
https://calendarforge.stream/
https://calendarforge.stream/sitemap.xml
```

其他实验应用不能写入 Calendar Forge 的 sitemap。未来每个网站绑定自己的域名和 sitemap，并使用自己的部署工作流。

## 9. Google Search Console 操作

### 9.1 添加资源

1. 打开 [Google Search Console](https://search.google.com/search-console)。
2. 选择 **Add property**。
3. 推荐选择 **Domain** 资源，输入不带协议的域名，例如 `your-domain.com`。
4. 按 Google 提供的 DNS TXT 记录完成域名验证。
5. 如果无法管理 DNS，也可以选择 **URL prefix**，再使用 HTML 文件、HTML 标签或 Google Analytics 验证。

域名验证覆盖该域名下的多个协议和子域名；URL prefix 验证范围更窄。验证时必须使用自己实际拥有和控制的域名。

### 9.2 提交 sitemap

1. 确认真实地址可以打开：`https://your-domain.com/sitemap.xml`。
2. 确认 sitemap 中的 `<loc>` 使用真实 HTTPS 域名。
3. 在 Search Console 左侧打开 **Sitemaps**。
4. 输入 `sitemap.xml`，点击提交。
5. 等待状态显示为已读取或成功处理。

可以使用浏览器或命令行先检查：

```bash
curl -I https://your-domain.com/
curl -I https://your-domain.com/robots.txt
curl -I https://your-domain.com/sitemap.xml
```

预期首页、robots 和 sitemap 至少返回 `200`，并且没有被登录、地区限制或错误的重定向拦截。

### 9.3 请求单页抓取

1. 在 Search Console 使用顶部的 URL Inspection。
2. 输入 `https://your-domain.com/`。
3. 点击测试实时网址，确认页面可抓取。
4. 点击请求编入索引。

请求只表示提交抓取请求，不保证立即收录。后续应观察覆盖率、页面体验、移动设备可用性和搜索查询。

## 10. 上线后的验收清单

### 网站访问

- [ ] 主域名使用 HTTPS；
- [ ] `http` 会正确跳转到 `https`；
- [ ] `www` 和非 `www` 的规范版本已经确定；
- [ ] 首页、robots 和 sitemap 返回 `200`；
- [ ] 不会把示例域名暴露在页面或搜索配置中。

### 产品功能

- [ ] 月份和年份切换正常；
- [ ] 地区切换正常；
- [ ] 节假日显示和隐藏正常；
- [ ] 打印布局没有导航和操作面板；
- [ ] 下载功能正常；
- [ ] 移动端没有溢出、遮挡或不可点击控件。

### 搜索基础

- [ ] 页面有唯一且准确的 `<title>`；
- [ ] 页面有准确的 meta description；
- [ ] sitemap 使用真实 URL；
- [ ] robots 没有误封首页；
- [ ] Search Console 已验证；
- [ ] sitemap 已提交；
- [ ] URL Inspection 能读取首页。

### 业务和合规

- [ ] 已添加真实联系信息；
- [ ] 已准备隐私政策和使用条款；
- [ ] 已复核地区节假日数据；
- [ ] 没有暗示与 General Blue、Apple 或其他品牌存在官方关系；
- [ ] 如果接入广告、联盟或分析工具，已补充相应披露和用户同意机制。

## 11. 常见问题排查

### Google 没有收录

依次检查：

1. 域名是否验证成功；
2. sitemap 是否使用真实 URL；
3. robots 是否误写成 `Disallow: /`；
4. 首页是否返回 `200`；
5. 页面是否需要登录或被防火墙拦截；
6. 是否刚刚发布，尚未完成抓取；
7. 页面是否只有重复、薄弱或没有独立价值的内容。

不要通过重复提交、隐藏关键词或批量制造低质量页面来“加速收录”。

### 自定义域名无法访问

- 检查 DNS 记录是否按托管平台要求填写；
- 确认域名没有被其他平台占用；
- 等待 DNS 传播；
- 在托管平台确认 HTTPS 证书已经签发；
- 暂时用平台分配的预览域名判断是不是代码本身的问题。

### sitemap 报错

- 确认 XML 文件格式完整；
- 确认 `<loc>` 是绝对 HTTPS URL；
- 确认 URL 与 Search Console 资源属于同一域名范围；
- 确认 sitemap 没有指向本地地址或示例域名。

## 12. 推荐的实际执行顺序

第一次发布建议按以下顺序执行：

1. 确认 `calendarforge.stream` 的 DNS 已按 GitHub Pages 要求配置；
2. 检查 `apps/calendar-forge/` 中的真实域名和运营邮箱；
3. 本地完成产品功能和移动端验收；
4. 直接上传到 Cloudflare Pages 或 Netlify；
5. 绑定域名并确认 HTTPS；
6. 在线检查首页、robots 和 sitemap；
7. 创建并验证 Google Search Console Domain 资源；
8. 提交 `sitemap.xml`；
9. 请求首页抓取；
10. 每周记录展示、点击、查询词、索引状态和用户反馈。

当前工程能交付的是静态网站和发布材料；域名购买、托管账号登录、DNS 修改、Search Console 验证和最终公开发布必须由拥有对应账号权限的人执行。
