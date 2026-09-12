# Going Global

> 面向中文团队的网站出海自动化流程项目。

本项目当前处于 **0 到 1 的产品定义阶段**。它要解决的不是“把中文网页翻译成英文”这么单一的问题，而是帮助一个没有出海经验的团队，按可复用、可追踪、可验收的流程，把网站带到一个新的国家或地区，并持续获得真实用户。

## 先读什么

1. [网站出海从 0 到 1 入门指南](docs/01-网站出海从0到1入门指南.md)
2. [自动化产品蓝图与 MVP 需求](docs/02-自动化产品蓝图与MVP需求.md)
3. [成熟案例拆解](docs/03-成熟案例拆解.md)
4. [90 天执行清单](docs/04-90天执行清单.md)
5. [垂直站点组合与规模化测试策略](docs/05-垂直站点组合与规模化测试策略.md)
6. [最近半个月搜索热点与可复制创意](docs/06-最近半个月搜索热点与可复制创意.md)
7. [Calendar Forge 部署说明](docs/07-Calendar-Forge部署说明.md)
8. [海外发布与 Google 收录操作指引](docs/08-海外发布与Google收录操作指引.md)
9. [四个实验站点选题分析](docs/09-四个实验站点选题分析.md)
10. [生产架构与站点生命周期](docs/10-生产架构与站点生命周期.md)
11. [GitHub Pages 与 Cloudflare 配置记录](docs/11-GitHub-Pages与Cloudflare配置记录.md)

## 实验站点

- [Calendar Forge](apps/calendar-forge/index.html)：生产候选，地区化月历与打印工具
- [Stackwise](apps/stackwise/index.html)：实验，职业化 AI 工具筛选器
- [Switchboard](apps/switchboard/index.html)：实验，手机型号与配件决策工具
- [Costume Cartographer](apps/costume-cartographer/index.html)：实验，Halloween 装扮规划器
- [Matchday Clock](apps/matchday-clock/index.html)：实验，赛事时区转换工具

## 当前工程结构

本仓库是 `going-global-labs` 组织下的孵化 Monorepo。每个网站在 `apps/` 下拥有独立代码边界；共享能力预留在 `packages/`，站点清单位于 `config/sites.json`。

Calendar Forge 是当前唯一配置为生产发布的站点，域名为 `calendarforge.stream`。它拥有独立工作流：[deploy-calendar-forge.yml](.github/workflows/deploy-calendar-forge.yml)，只在 Calendar Forge 代码变化时部署 `apps/calendar-forge/`。

其他 4 个站点目前是实验应用，不会自动部署到生产域名。验证成功后，再迁移到组织下独立生产仓库。

## 本地预览

执行：

```text
python3 -m http.server 4173 --directory apps
```

然后打开：

```text
http://localhost:4173/calendar-forge/
http://localhost:4173/stackwise/
http://localhost:4173/switchboard/
http://localhost:4173/costume-cartographer/
http://localhost:4173/matchday-clock/
```

完整生产方式见：[生产架构与站点生命周期](docs/10-生产架构与站点生命周期.md)。
发布和 Google 收录步骤见：[海外发布与 Google 收录操作指引](docs/08-海外发布与Google收录操作指引.md)。

## 一句话理解项目

用户输入产品资料、目标市场和现有网站地址，系统帮助他完成：

```text
选择市场
  -> 评估需求与合规风险
  -> 建立本地化策略
  -> 生成并审核多语言内容
  -> 配置多语言网站与 SEO
  -> 接入支付、客服、分析工具
  -> 发布并验证
  -> 持续做实验、获客和迭代
```

其中，机器负责重复、结构化、可校验的工作；用户负责价值判断、品牌表达、法律确认和最终发布。

## 当前文档的目标

- 让完全没有经验的人理解“网站出海”包括哪些工作。
- 把一件模糊的大事拆成可以逐项完成的任务。
- 定义第一版产品应该做什么，以及暂时不做什么。
- 为后续界面、后端、任务编排、内容引擎和数据分析开发提供共同词汇。

## 重要提醒

本文档是产品和执行框架，不构成法律、税务、隐私或支付合规意见。不同国家、行业和商业模式的要求差别很大，正式上线前应让当地律师、税务顾问或支付服务商确认关键事项。
