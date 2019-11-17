# CLIENT_ADMIN_ANTD

Umi + Antd + Typescript + React-hook 实现 `公羊阅读` 后管系统。

开这个工程的目的是为了掌握 typescipt 和 react-hook 在实际项目中的应用，本项目没有使用 umi 自带的 dva 做数据流，因为 dva + ts 写法个人感觉丑陋无比，会写很多让人莫名其妙的接口，dk 选择用 react 自带的 react-hook 处理数据，事实证明完全够用了，用最少最简洁的代码实现需求。

### Details

- 菜单权限、按钮权限怎么设计？
- 服务端分页而非客户端分页怎么整？
- 点击下一页时如何携带参数查询（默认是不带参数的）？
- effect hook 无限循环？
- 怎么解决 Antd Form + Typescript 恶心的报错提示？
- 如何写单元测试？

### Run

``` bash
$ git clone git@github.com:py-novel/client_admin_antd.git
$ cd client_admin_antd
$ yarn
$ npm start
```

### Server

这个应用并不会实际请求服务端的数据，而是在前端本地 mock 的数据。