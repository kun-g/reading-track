阅读追踪
===

之前读到[Serverless 实战：打造个人阅读追踪系统](https://blog.jimmylv.info/2017-06-30-serverless-in-action-build-personal-reading-statistics-system/)，觉得非常有意思，就照着实现了一套，用了一段时间之后，发现还有很多的地方可以扩展，于是就决定认真的搞一搞。这个库就是为了解决实现这个系统过程中遇到的技术问题。

这个系统的核心功能就是收集你要阅读的资料信息，根据完成情况给你生成进度报告。

这个系统的工作流程大致如下：
1. 我做出ReadItLater的指令 -> IFTTT接收到通知
2. IFTTT通知Github建立一个对应的Issue -> Github通知预设的Webhook和Zenhub
3. Webhook里，我们给Issue增加Milestone和StoryPoint
4. 至此完成一个ReadItLater记录的创建
5. 完成ReadItLater的阅读时，可以手动/自动的去关闭Github上对应Issue，Zenhub的报告会自动更新

真正吸引我的是使用Issue管理待阅读的资料，以及Zenhub提供的各种报告，这相当于给了我一个进度条，甚至还有一个大致的完成时间。

## 第一阶段：实现原文的核心功能

### [webtask](https://webtask.io)

webtask简单来说就是一个运行你提供的代码却又不需要你去管理服务器的平台。

体验之后，我觉得这真是了不起的技术，因为它把开发人员从服务器管理、环境设置等事务性工作中解放了出来。我的主职是网络游戏开发，要管理多个项目、几十台服务器，对此感触颇深。希望随着我对serverless技术的理解的加深，能将其应用到工作中。

#### [环境设置](https://webtask.io/cli)

``` bash
npm install -g wt-cli
wt init
```

随后会弹出页面让你设置帐号，完成后可以跟着教程走一边流程，直观的感受一下Serverless的魅力。

#### 启动服务

wt create index --bundle --secret GITHUB_TOKEN=$GITHUB_TOKEN --secret ZENHUB_TOKEN=$ZENHUB_TOKEN --secret ZENHUB_TOKEN_V4=$ZENHUB_TOKEN_V4

const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = req.webtaskContext.secrets
const { ZENHUB_TOKEN, REPO_ID, GITHUB_TOKEN } = req.webtaskContext.secrets

### [Github](https://www.github.com)

#### 更新Issue的Millstone

https://github.com/matthew-andrews/isomorphic-fetch

### [Zenhub](https://www.zenhub.com)

####  设置story point 和 Rlease

### [IFTTT](https://www.ifttt.com)

IFTTT就是if this then that，其宗旨是Put the internet to work for you。花点心思，就能通过IFTTT把一些服务连接起来，实现一些自动化功能。比如在这里要实现的系统里，我们增加/完成ReadItLater的事件就是trigger，Github上建立/完成Issue就是动作，使用IFTTT把这些串联起来，就能实现我们的阅读追踪系统了。

设置追加issue的applet

https://ifttt.com/applets/79668202d-github-issue

https://maker.ifttt.com/trigger/{event}/with/key/{key}

https://ifttt.com/settings 这里可以关闭短网址

## 进阶版

### Travis CI

### TamperMonkey
 
- [x] Tampermonkey Script

### Wallbag

### 根据材料类型/来源做额外处理

#### 书籍 - 豆瓣

抓取书籍信息，在Issue里提供更详细的信息

https://developers.douban.com/wiki/?title=book_v2#get_book

根据字数估算Story Point

判断是否是Kindle Unlimited书籍并给出链接


#### 书籍 - 文件

#### 文章
- [ ] Process Different source
  - [ ] Douban
     - [ ] calculate story point base on pages
     - [ ] extract book info
     - [ ] add buy info
     - [ ] add kindle/kindle unlimited info
- [ ] 可视化