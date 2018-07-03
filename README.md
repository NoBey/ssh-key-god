# ssh-key-god

> 管理本机ssh链接

---

#### 安装

> npm i ssh-key-god -g


#### 查看连接过的ssh
>  skg list

![list](./res/list.png)

#### 直接连接 ssh
> skg go id   - [id] 是 list 后给出的id

![go](./res/go.png)


#### 删除ssh连接  
> skg del id  - [id] 是 list 后给出的id

![go](./res/del.png)

#### 设置ssh连接 缩写 
> skg set name id 是 list 后给出的id name 是使用的name 下次就可以直接go name 
> 同时支持了非root用户的使用, skg set id user  user 为id要使用的user
> 可以同时配置 user 和 name 



### 关于桌面版

> 后面研究好会发出更方便的版本

