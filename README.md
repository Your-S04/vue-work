# 简单论坛

这是一个使用 Vue 3、Vite、Vue Router 和 Axios 编写的简单论坛前端项目。

## 功能

- 用户登录
- 帖子列表和分页
- 查看帖子详情和评论
- 发布帖子
- 点赞和取消点赞
- 发表评论
- 删除自己的帖子；管理员可以删除所有帖子
- 本地测试账号和示例数据

## 安装依赖

```bash
npm install
```

如果 PowerShell 提示不允许运行 `npm.ps1`，可以使用：

```bash
cmd /c npm install
```

## 启动项目

```bash
npm run dev
```

如果 PowerShell 无法运行该命令，可以使用：

```bash
cmd /c npm run dev
```

命令执行后，打开终端显示的本地地址。

## 本地测试

项目内置以下测试账号：

- 普通用户：`20240001` / `student123`
- 管理员：`20240002` / `admin123`

使用测试账号登录后，帖子、点赞和评论数据会保存在浏览器的 `localStorage` 中。普通用户只能删除自己发布的帖子，管理员可以删除所有本地测试帖子。

需要恢复初始示例数据时，请在浏览器开发者工具中清除本网站的本地存储数据。

## 接口

接口地址在页面代码中配置为：

```text
https://m1.apifoxmock.com/m1/8648730-8429883-default/api/v1
```

项目使用的主要接口：

```text
POST   /auth/login
GET    /posts?page=页码&page_size=每页条数
POST   /posts
GET    /posts/:id
POST   /posts/:id/like
POST   /posts/:id/comments
DELETE /posts/:id
```

## 打包

```bash
npm run build
```

PowerShell 无法直接运行时：

```bash
cmd /c npm run build
```

打包完成后会生成 `dist` 文件夹。将整个 `dist` 文件夹部署到网站服务器即可。

Vue Router 使用浏览器历史模式，服务器需要把未知路径返回 `index.html`，否则直接访问 `/home` 或 `/posts/20001` 可能出现 404。

## 技术栈

- Vue 3
- Vite
- Vue Router
- Axios
