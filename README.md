# elasticsearch-demo

## 1. 环境Java配置
- 1.下载java JDK
- http://download.oracle.com/otn-pub/java/jdk/8u151-b12/e758a0de34e24606bca991d704f6dcbf/jdk-8u151-macosx-x64.dmg
- java -version 查看是否安装成功

## 2. 安装elasticsearch
- brew install elasticsearch
- brew info elasticsearch  查看安装信息
- elasticsearch 启动命令
- brew install elasticsearch
- brew upgrade elasticsearch
- brew services start elasticsearch
## 2.1 下载地址 elasticsearch
- https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.2.1.zip


## index
- http://127.0.0.1:9200
```
http.cors.enabled: true  
http.cors.allow-origin: "*"
```
- 在elasticserch中 添加这两个配置项才能访问elasticsearch-head

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

### 概念解释

#### 索引（index）-> mysql.db
```
一个索引就是一个拥有几分相似特征的文档的集合。
比如说，你可以有一个客户数据的索引，另一个产品目录的索引，还有一个订单数据的索引。
一个索引由一个名字来标识（必须全部是小写字母的），
并且当我们要对对应于这个索引中的文档进行索引、搜索、更新和删除的时候，都要使用到这个名字。
在一个集群中，如果你想，可以定义任意多的索引。
```

#### 类型（type）-> mysql.table
```
在一个索引中，你可以定义一种或多种类型。
一个类型是你的索引的一个逻辑上的分类/分区，其语义完全由你来定。
通常，会为具有一组共同字段的文档定义一个类型。
比如说，我们假设你运营一个博客平台并且将你所有的数据存储到一个索引中。
在这个索引中，你可以为用户数据定义一个类型，为博客数据定义另一个类型，当然，也可以为评论数据定义另一个类型。
```

#### 文档（document）-> mysql.一条记录
```
一个文档是一个可被索引的基础信息单元。
比如，你可以拥有某一个客户的文档，某一个产品的一个文档，当然，也可以拥有某个订单的一个文档。
文档以JSON（Javascript Object Notation）格式来表示，而JSON是一个到处存在的互联网数据交互格式。
```

#### 对比
- mysql： db->tables->rows->columns
- es:     index->type->doc->fields

# **搜索**

## _search
- 可以检索当前index.type下的所有信息
- GET /megacorp/employee/_search
- 默认情况会返回检索到的前10个结果

## query string
- 可以指定查询条件
- GET /megacorp/employee/_search?q=last_name:Smith

## query DSL
-  GET /megacorp/employee/_search  {"query":{"match":{"last_name":"Smith"}}}

## query DSL 过滤器
- GET /megacorp/employee/_search
```
{
    "query" : {
        "filtered" : {
            "filter" : {
                "range" : {
                    "age" : { "gt" : 30 } <1>
                }
            },
            "query" : {
                "match" : {
                    "last_name" : "smith" <2>
                }
            }
        }
    }
}
```
- <1>是区间过滤器
- <2>是查询条件

## 全文检索 **match**
- GET /megacorp/employee/_search
```{
         "query" : {
             "match" : {
                 "about" : "rock climbing"
             }
         }
     }

```
- 返回
```
{
   ...
   "hits": {
      "total":      2,
      "max_score":  0.16273327,
      "hits": [
         {
            ...
            "_score":         0.16273327, <1>
            "_source": {
               "first_name":  "John",
               "last_name":   "Smith",
               "age":         25,
               "about":       "I love to go rock climbing",
               "interests": [ "sports", "music" ]
            }
         },
         {
            ...
            "_score":         0.016878016, <2>
            "_source": {
               "first_name":  "Jane",
               "last_name":   "Smith",
               "age":         32,
               "about":       "I like to collect rock albums",
               "interests": [ "music" ]
            }
         }
      ]
   }
}
```
- 包含rock climbing 的都出来了 _score 表示关联程度
- 相关性(relevance)的概念在Elasticsearch中非常重要，而这个概念在传统关系型数据库中是不可想象的，因为传统数据库对记录的查询只有匹配或者不匹配。

## 短语检索 **match_phrase**
- GET /megacorp/employee/_search
```
{
      "query" : {
          "match_phrase" : {
              "about" : "rock climbing"
          }
      }
  }
```

## 高亮我们的检索 **highlight**
- GET /megacorp/employee/_search
```
{
     "query" : {
         "match_phrase" : {
             "about" : "rock climbing"
         }
     },
     "highlight": {
         "fields" : {
             "about" : {}
         }
     }
 }
```

# 聚合

## aggs
- GET /megacorp/employee/_search
```
{
  "aggs": {
    "all_interests": {
      "terms": { "field": "interests" }
    }
  }
}
```
- buckets：[{doc_count:2}] 返回多一个doc_count字段

## 增加聚合条件
- GET /megacorp/employee/_search
```
{
  "query": {
    "match": {
      "last_name": "smith"
    }
  },
  "aggs": {
    "all_interests": {
      "terms": {
        "field": "interests"
      }
    }
  }
}
```
## 聚合-分级汇总
- GET /megacorp/employee/_search
```
{
      "aggs" : {
          "all_interests" : {
              "terms" : { "field" : "interests" },
              "aggs" : {
                  "avg_age" : {
                      "avg" : { "field" : "age" }
                  }
              }
          }
      }
  }

```

# 集群健康
- GET /_cluster/health
- green  所有主要分片和复制分片都可用
- yellow 所有主要分片可用，但不是所有复制分片都可用
- red    不是所有的主要分片都可用

# 分片shard
- 一个分片本身就是一个完整的搜索引擎。
- 复制分片可以提供备份功能，读请求

# 添加索引
-  索引创建完成的时候，主分片的数量就固定了，但是复制分片的数量可以随时调整
- 默认情况下，一个索引被分配5个主分片，每个主分片都有一个复制分片
- PUT /blogs
```{
        "settings" : {
           "number_of_shards" : 3,
           "number_of_replicas" : 1
        }
     } 
```
# 增加复制分片的数量
- PUT /blogs/_settings
```
{
   "number_of_replicas" : 2
}             
  
```
- 将复制分片增加到2个
        
# 文档元数据
- _index	文档存储的地方
- _type	    文档代表的对象种类
- _id	    文档的唯一编号
  
 
 # 错误处理
 - {"error":"Content-Type header [application/x-www-form-urlencoded] is not supported","status":406}
 ```
 curl -H "Content-Type: application/json" -XPOST 192.168.14.173:32000/test_index_1221/test_type/5 -d '{'user_name':"xiaoming"}'
 {"error":"Content-Type header [application/x-www-form-urlencoded] is not supported","status":406}
 1
 2

```
  
# grafana

## mac-install
- brew install grafana
- brew services start grafana
- brew services restart grafana
- brew services stop grafana
- admin/admin

## linux-install
- wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-4.6.3.linux-x64.tar.gz
- gunzip grafana-4.6.3.linux-x64.tar.gz
- tar -xvf grafana-4.6.3.linux-x64.tar
- mv grafana-4.6.3 grafana

## index
- - http://127.0.0.1:3000

## grafana 查询

### query选项
- 是值的查询
```
{
        name:"jay",
        os: "mac",
        memUsed: Math.floor(Math.random()*1000),
        cpuUsed: Math.floor(Math.random()*800),
        processNum:Math.floor(Math.random()*600),
        time: new Date()
    }

```
- 如果query中写的是 mac 就是把数据中所有os是mac的数据拿出来绘图
- * 表示所有数据

## metric
- 选择绘图类型
- average  sum max min 等等
- 可以选择绘图的字段 比如cpuUsed

## GroupBy
- 可以选择多个分组条件
- terms name.keyword 按名字  name.keyword  os.keyword  字符串都需要选择keyword
- Date Histogram 时间

## Data Source
- 数据源


## template
- http://docs.grafana.org/features/datasources/elasticsearch/#templating
- 主要是query
- http://docs.grafana.org/features/datasources/elasticsearch/#templating
- {"find": "terms", "field": "os.keyword", "size": 1000}
- 写成 os.keyword 才能把所有的类型列出来
- 使用作图的时候 query 栏 写 $os
- 多个选项 $os and $name  或者  [[os]] and [[name]]  都可以
- [[name]]-[[os]] 可以修改标题

# kibana
- https://artifacts.elastic.co/downloads/kibana/kibana-6.2.1-darwin-x86_64.tar.gz
- tar -xvf kibana-6.2.1-darwin-x86_64.tar.gz
- mv kibana-6.2.1-darwin-x86_64 kibana

## 配置
- server.port: 5601
- server.host: "0.0.0.0"
- elasticsearch.url: "http://127.0.0.1:9200"
- kibana.index: ".kibana"

## 启动
- sudo ./kibana
- nohup ./kibana &
## index
- http://localhost:5601/



