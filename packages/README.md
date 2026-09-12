# Shared Packages

这里放跨应用、与具体业务无关的共享能力。

计划中的包：

- `ui`：无业务 UI 组件；
- `seo`：metadata、canonical、sitemap 辅助；
- `analytics`：统一事件名和埋点客户端；
- `config`：环境变量和运行时配置校验。

只有至少两个应用真实需要、接口稳定且没有业务耦合的代码，才进入这里。短期重复代码不要急于抽象。
