# Sheng Personal Website

Sheng 的暗色科技风个人网站。首版为单页 Astro 站点，通过页面锚点展示个人定位、正在学习的内容、入行路线和回答原则。

## 本地运行

需要 Node.js 22.12.0 或更高版本。

```powershell
npm install
npm run dev
```

开发服务器启动后，按终端显示的本地地址访问网站。

## 验证与预览

```powershell
npm test
npm run check
npm run build
npm run verify:site
npm run preview
```

- `npm test`：运行内容、锚点与动效能力测试。
- `npm run check`：执行 Astro 和 TypeScript 检查。
- `npm run build`：生成静态站点到 `dist/`。
- `npm run verify:site`：只检查 `dist/index.html` 的发布契约，因此需在构建后运行。
- `npm run preview`：本地预览已构建的网站。

## 内容维护

- 身份、个人简介、导航、学习方向、路线图和回答原则统一维护在 `src/data/profile.ts`。
- 已确认的人物形象位于 `src/assets/sheng-ip-hero.png`；人物本身不应被重新生成或修改。
- 后续确认真实联系方式或社交地址后，通过 `src/data/profile.ts` 中的 `profile.links` 添加，不要直接在页面组件中写占位链接。

首版不包含联系表单、数据服务、主题切换或未验证的履历与指标。部署到真实域名后，再补充 canonical、站点地图和分享图片地址。

## 第三方来源

模板和效果组件的来源及许可证原文见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
