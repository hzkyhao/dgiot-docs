---
layout: post
title: "MinGW + MSYS 配置"
description: ""
category: Windows
tags: [MinGW, MSYS]
---
最近写一些测试代码需要在linux下编译，使用在线安装方式装了MinGW 和 MSYS，简单记录下配置过程供以后使用。  
1. 运行mingw-get install mintty，在线安装mintty，用msys.bat --mintty参数即可启动mintty，这个比自带的控制台好用太多了。mintty的大部分代码来自putty，界面风格也跟我喜欢的putty一样简洁，不过好像没有putty稳定，偶尔会死掉，比如我每次运行gcc 4.5.0中的cpp命令都会失去响应。  
2. 修改中文乱码。编辑 `/etc/profile` 文件，增加 `alias ls="ls --color=tty --show-control-chars"`一行让ls命令可以正常显示中文。
编辑~/.inputrc 文件，修改以下几行并重启msys即可正常输入中文了。  
```bash
set meta-flag on  
set input-meta on  
set output-meta on  
set convert-meta off 
```
