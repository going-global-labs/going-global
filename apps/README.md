# Applications

`apps/` 是所有网站应用的代码边界。每个子目录代表一个独立产品，不把多个产品拼成一个发布目录。

## 应用状态

| 应用 | 状态 | 生产域名 | 部署方式 |
| --- | --- | --- | --- |
| `calendar-forge` | staging / production candidate | `calendarforge.stream` | 独立 GitHub Pages workflow |
| `stackwise` | experiment | 待定 | 暂不发布 |
| `switchboard` | experiment | 待定 | 暂不发布 |
| `costume-cartographer` | experiment | 待定 | 暂不发布 |
| `matchday-clock` | experiment | 待定 | 暂不发布 |

## 新增应用规则

新站点必须：

1. 在 `apps/<site-id>/` 下拥有自己的入口和资源；
2. 在 `config/sites.json` 注册；
3. 写清状态、目标市场、核心动作和域名；
4. 在验证成功前不接入生产域名；
5. 不复用其他站点的业务数据、密钥或 sitemap；
6. 需要正式发布时，新增自己的部署 workflow；
7. 需要后台、API 或数据库时，在该应用内增加服务边界，或迁移到独立仓库。

## 单应用本地预览

```bash
python3 -m http.server 4173 --directory apps/calendar-forge
```

然后打开 `http://localhost:4173`。其他应用只需把命令中的目录替换成对应的 `apps/<site-id>`。
