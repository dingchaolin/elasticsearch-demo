# elasticsearch-demo

## 1. 环境Java配置
- 1.下载java JDK
- http://download.oracle.com/otn-pub/java/jdk/8u151-b12/e758a0de34e24606bca991d704f6dcbf/jdk-8u151-macosx-x64.dmg
- java -version 查看是否安装成功

## 2. 安装elasticsearch
- brew install elasticsearch
- brew info elasticsearch  查看安装信息
- elasticsearch 启动命令

## 3. 访问
- 127.0.0.1:9200

## 配置可视化界面
-  git clone git://github.com/mobz/elasticsearch-head.git
-  cd elasticsearch-head
-  npm install
-  npm install grunt-cli

- 修改服务器监听地址，地址目录：head/Gruntfile.js
```
connect: {
  server: {
      options: {
          port: 9100,
          hostname: '*',
          base: '.',
          keepalive: true
      }
  }
}

```
-  npm start
- 要先启动 elasticsearch 再启动这个服务

## postman 测试

### 1. 创建index
- PUT http://localhost:9200/dcl-index
- 返回
```
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "dcl-index"
}
```

### 2.存入数据
- POST http://localhost:9200/dcl-index/employee/1
``` body
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}
```
- 返回值
```
{
    "_index": "dcl-index",
    "_type": "employee",
    "_id": "1",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "created": true
}
```

### 3.查询数据
- GET http://localhost:9200/dcl-index/employee/1
```
{
          "_index": "dcl-index",
          "_type": "employee",
          "_id": "1",
          "_version": 1,
          "found": true,
          "_source": {
              "first_name": "John",
              "last_name": "Smith",
              "age": 25,
              "about": "I love to go rock climbing",
              "interests": [
                  "sports",
                  "music"
              ]
          }
      }

```

### 个人理解-对比mysql
- index  数据库名
- type   表名
