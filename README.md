<div align="center">

# 🔐 CertHub · SSL 证书助手

**基于 Cloudflare Worker / EdgeOne Pages 的全自动化 SSL 证书申请与下发平台**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![EdgeOne](https://img.shields.io/badge/Tencent-EdgeOne-00A4FF?logo=tencentqq&logoColor=white)](https://edgeone.ai/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Hono](https://img.shields.io/badge/Built%20with-Hono-E36002)](https://hono.dev/)

[English](#english) · [快速部署](#-一键部署) · [在线演示](#-在线演示) · [使用文档](#-配置说明) · [常见问题](#-常见问题)

</div>

---

## 📖 项目介绍

**CertHub（SSL 证书助手）** 是一个 **免费、开源、全自动化** 的 SSL 证书申请与下发平台，依托 Cloudflare Workers / Tencent EdgeOne Pages 等 Serverless 平台运行，**无需服务器即可部署**。

通过自动化的 CNAME 与 DNS 操作，平台可以全自动完成域名验证、申请证书并将其同步下发到任意服务器或客户端。

### ✨ 核心优势

- 🚀 **无服务器部署**：依托 Cloudflare Worker / EdgeOne Pages，**完全免费**，亦支持私有化部署
- 🔁 **一次配置，永久使用**：支持 DCV 代理与自动验证，**只需设置一次 CNAME 记录**即可永久续期
- 🏢 **多服务器同步**：相比 `acme.sh` 单机使用，更适合 **多服务器、内网共享** 同一证书的场景
- 🌐 **多 CA 支持**：内置 `Let's Encrypt`、`ZeroSSL`、`Google Trust Service`、`SSL.com` 四大主流 CA
- 🎨 **现代化管理后台**：终端风格 UI，支持证书全生命周期管理（申请 / 续期 / 吊销 / 下载 PFX / ZIP）
- 🔌 **完整 API**：提供完整 RESTful API，方便接入到 1Panel / 宝塔 / 自建系统

---

## 🖼️ 项目截图

### 管理控制台

> 终端风格的实时仪表盘，一目了然查看证书总览、订单状态与最新动态。
<p align="center">
  <img src="images/QQ20250506-153642.png" alt="CertHub 证书详情页" width="900" />
</p>



### 证书订单详情

> 支持查看完整签发流程进度，并提供 **下载证书 / 下载密钥 / ZIP / PFX / 续期 / 吊销** 等一站式操作。

<p align="center">
  <img src="images/QQ20250506-153705.png" alt="CertHub 管理控制台" width="900" />
</p>

---

## 🌍 在线演示

- 演示站点：<https://newssl.524228.xyz/>

> ⚠️ 演示平台 **不会主动泄漏您的密钥数据**，但出于安全考虑，建议在生产环境使用自己的 Cloudflare 账号私有化部署。

---

## 🚀 一键部署

| Cloudflare Workers (全球) | EdgeOne Pages (国际) | EdgeOne Pages (中国) |
| :---: | :---: | :---: |
| [<img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" width="220" />](https://deploy.workers.cloudflare.com/?url=https://github.com/PIKACHUIM/CFWorkerACMEs) | [<img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="使用 EdgeOne Pages 部署" width="220" />](https://edgeone.ai/pages/new?project-name=oplist-api&repository-url=https://github.com/PIKACHUIM/CFWorkerACME&build-command=npm%20run%20build-eo&install-command=npm%20install&output-directory=public&root-directory=./) | [<img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="使用 EdgeOne Pages 部署" width="220" />](https://console.cloud.tencent.com/edgeone/pages/new?project-name=oplist-api&repository-url=https://github.com/PIKACHUIM/CFWorkerACME&build-command=npm%20run%20build-eo&install-command=npm%20install&output-directory=public&root-directory=./) |

---

## 🛠️ 技术栈

| 层级 | 技术 |
| :--- | :--- |
| **运行时** | Cloudflare Workers · EdgeOne Pages Functions · Node.js (Docker) |
| **后端** | [Hono](https://hono.dev/) · [acme-client](https://github.com/publishlab/node-acme-client) · `node-forge` · `crypto-js` |
| **前端** | React · Vite · TypeScript |
| **存储** | Cloudflare D1 (SQLite) |
| **邮件** | [Resend](https://resend.com/) |

---

## 📦 本地开发与部署

### 1. 克隆代码

```bash
git clone https://github.com/PIKACHUIM/CFWorkerACME.git
cd CFWorkerACME
```

### 2. 安装依赖

```bash
npm install
npm run web-install
```

### 3. 配置环境变量

复制示例配置文件并按需修改：

```bash
cp wrangler.example.jsonc wrangler.jsonc
```

```jsonc
{
  "vars": {
    "MAIL_KEYS": "",
    "MAIL_SEND": "noreply@example.com",
    "SIGN_AUTH": "",
    "DCV_AGENT": "",
    "DCV_EMAIL": "account@example.com",
    "DCV_TOKEN": "",
    "DCV_ZONES": "",
    "GTS_useIt": "", "GTS_keyMC": "", "GTS_keyID": "", "GTS_KeyTS": "",
    "SSL_useIt": "true", "SSL_keyMC": "", "SSL_keyID": "", "SSL_KeyTS": "",
    "ZRO_useIt": "true", "ZRO_keyMC": "", "ZRO_keyID": "", "ZRO_KeyTS": ""
  },
  "d1_databases": [
    {
      "binding": "DB_CF",
      "database_name": "***********",
      "database_id": "***************************"
    }
  ]
}
```

### 4. 本地调试

```bash
# Cloudflare Workers 本地调试
npm run dev-cf

# EdgeOne Pages 本地调试
npm run dev-eo

# 仅前端调试
npm run web-dev
```

### 5. 部署到云端

```bash
# 部署到 Cloudflare Workers
npm run deploy-cf

# 部署到 EdgeOne Pages
npm run deploy-eo
```

### 6. Docker 部署（可选）

```bash
docker compose up -d
```

> 项目同时提供 `Dockerfile` 与 `Dockerfile-Lite` 两种镜像方案，可按需选用。

---

## ⚙️ 配置说明

### 通用配置

| 名称 | 类型 | 说明 | 示例 / 备注 |
| :--- | :--- | :--- | :--- |
| `MAIL_KEYS` | string | Resend API Key（用于邮件通知） | `re_wvRR+z5AqmL3rAXp8CQW0BWKX` · [获取地址](https://resend.com/api-keys) |
| `MAIL_SEND` | string | Resend 发件邮箱 | `noreply@example.com` |
| `SIGN_AUTH` | string | Cookie / 用户验证签名加密密钥（自定义随机串） | `PCUG8dc9Yal4ufhe2SRn3NJRJ+flg/B42s1uaUNk8p0a0lG2hw34qP` |

### DCV 自动验证代理（推荐配置）

> 配置 DCV 代理后，**只需设置一次 CNAME 记录** 即可永久自动续期。

| 名称 | 类型 | 说明 | 示例 / 备注 |
| :--- | :--- | :--- | :--- |
| `DCV_AGENT` | string | CloudFlare DCV 代理域名（根域名） | `dcv.example.com` |
| `DCV_EMAIL` | string | CloudFlare 账号邮箱 | `user@example.com` |
| `DCV_TOKEN` | string | CloudFlare API Key | [API Tokens](https://dash.cloudflare.com/profile/api-tokens) |
| `DCV_ZONES` | string | CloudFlare Zone ID | [Dashboard](https://dash.cloudflare.com/) |

### CA 厂商配置

每个 CA 都遵循 `XXX_useIt` / `XXX_keyMC` / `XXX_keyID` / `XXX_KeyTS` 的命名规则：

| 前缀 | CA 厂商 | 获取地址 |
| :--- | :--- | :--- |
| `GTS_` | Google Trust Service | [Google Public CA Tutorial](https://cloud.google.com/certificate-manager/docs/public-ca-tutorial?hl=zh-cn) |
| `SSL_` | SSL.com ACME | [SSL.com Account](https://secure.ssl.com/account) |
| `ZRO_` | ZeroSSL ACME | [ZeroSSL Developer](https://app.zerossl.com/developer) |

| 字段 | 含义 |
| :--- | :--- |
| `XXX_useIt` | 是否启用该 CA（`true` / 留空） |
| `XXX_keyMC` | EAB-MAC 密钥 |
| `XXX_keyID` | EAB 账号 ID |
| `XXX_KeyTS` | ACME 私钥（PEM 格式） |

> 💡 **Let's Encrypt** 默认在 Cloudflare Workers 上会出现 SSL 525 错误，需要使用 Nginx 反向代理（见下方[备注说明](#-备注说明)）。

---

## 📝 备注说明

### Let's Encrypt 反向代理配置

`Let's Encrypt` 在 Cloudflare Worker 上会抛出 SSL 连接失败问题（525 错误）。本项目默认使用代理 `https://encrys.524228.xyz/directory`，你也可以使用 Nginx 自建：

```nginx
location ^~ /directory {
    proxy_pass https://acme-v02.api.letsencrypt.org/directory;
    sub_filter acme-v02.api.letsencrypt.org encrys.524228.xyz;
    sub_filter_types *;
    sub_filter_once off;
    proxy_set_header Host acme-v02.api.letsencrypt.org;
    proxy_set_header Accept-Encoding "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    add_header X-Cache $upstream_cache_status;
    add_header Cache-Control no-cache;
}

location /acme/ {
    proxy_pass https://acme-v02.api.letsencrypt.org/acme/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    add_header X-Cache $upstream_cache_status;
    add_header Cache-Control no-cache;
}
```

---

## ❓ 常见问题

<details>
<summary><b>Q：已经有 <code>acme.sh</code> 了，为什么还需要 CertHub？</b></summary>

1. **多机共享**：`acme.sh` 是单机证书申请脚本；CertHub 解决 **多服务器 / 内网共用同一证书** 的同步下发问题，可通过网页或 API 同步证书。
2. **永久 CNAME**：`acme.sh` 申请通配符证书时需要重复设置 TXT 记录；CertHub **只需设置一次 CNAME** 即可永久续期。
3. **零门槛**：如果你熟悉 `acme.sh` 且没有上述需求，使用 `acme.sh` 也完全够用。

</details>

<details>
<summary><b>Q：和宝塔 / 1Panel 的 SSL 证书申请功能有什么区别？</b></summary>

定位类似来此加密（<https://lcjm.cc/>），把申请验证过程移到了 **服务端 / Serverless 平台**，更方便 DCV 代理与多端同步。

</details>

<details>
<summary><b>Q：演示平台安全可靠吗？</b></summary>

演示平台 **不会主动泄漏** 您的密钥数据，但无法保证您的证书密钥 100% 安全。如对安全性有较高要求，**强烈建议使用自己的 Cloudflare / EdgeOne 账号私有化部署**。本项目完全开源，可审计。

</details>

---

## 💚 项目赞助

本项目 CDN 加速及安全防护由 **Tencent EdgeOne** 赞助：EdgeOne 提供长期有效的免费套餐，包含不限量的流量和请求，覆盖中国大陆节点，且无任何超额收费。

🔗 [亚洲最佳 CDN、边缘和安全解决方案 - Tencent EdgeOne](https://edgeone.ai/zh?from=github)

<p align="center">
  <img src="https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png" alt="EdgeOne" width="400" />
</p>

---

## 🔗 引用与致谢

- [acmesh-official/acme.sh](https://github.com/acmesh-official/acme.sh) — A pure Unix shell script implementing ACME client protocol
- [publishlab/node-acme-client](https://github.com/publishlab/node-acme-client) — Simple and unopinionated ACME client for Node.js
- [Hono](https://hono.dev/) — Ultrafast web framework for the Edges

---

## 📄 License

本项目基于 [Apache License 2.0](LICENSE) 开源，欢迎贡献代码与提出建议！

<div align="center">

**如果这个项目对你有帮助，请点一颗 ⭐ Star 支持一下！**

</div>