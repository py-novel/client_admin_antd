# CLIENT_ADMIN_ANTD

![](https://github.com/dkvirus/client_admin_antd/workflows/.github/workflows/ci.yml/badge.svg)

Umi + Antd + Typescript + React-hook 实现 `公羊阅读` 后管系统。

开这个工程的目的是为了掌握 typescipt 和 react-hook 在实际项目中的应用，本项目没有使用 umi 自带的 dva 做数据流，因为 dva + ts 写法个人感觉丑陋无比，会写很多让人莫名其妙的接口，dk 选择用 react 自带的 react-hook 处理数据，事实证明完全够用了，用最少最简洁的代码实现需求。

e.g. 单表增删改查。

### Run

``` bash
$ git clone git@github.com:py-novel/client_admin_antd.git
$ cd client_admin_antd
$ yarn
$ npm start      <= 启动客户端应用，访问 localhost:8000
```

### Server

这个应用不会请求服务端真实数据，通过 [json-server](https://npm.taobao.org/package/json-server) 模拟一个客户端的数据库，可以进行增删改查操作。

``` bash
$ npm run serve   <= 启动模拟服务，之后在网页上可以做增删改查操作
```
