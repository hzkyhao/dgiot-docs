---
layout: post
title: "Go语言交叉编译环境搭建"
description: ""
category: Pages
tags: [pages template]
---
Go对交叉编译有较完善的支持，我们以Linux环境编译windows目标文件为例，介绍如何从零搭建一个Go语言交叉编译环境。

首先从[Go project's downloads page](http://golang.org/dl/)下载源码包解压，设置环境变量并make。

	export GOROOT=~/go     #go源码解压的路径，这里假设为用户的根目录
	export PATH=$GOROOT/bin:$PATH
	export CGO_ENABLED=0
	export GOOS=windows    #如果目标文件是linux则改成GOOS=linux
	export GOARCH=386      #如果是64位则改成GOARCH=amd64
	cd ~/go/src && ./make.bash

此时在`~/go/pkg`目录下已经能看到windows_386版本的系统库文件。旧版go可能会要求设置GOPATH环境变量，GOPATH环境变量用于指定除$GOROOT之外的包含Go项目源代码和二进制文件的目录。go install和go tool会用到GOPATH作为编译后二进制的存放目的地和import包时的搜索路径。我们直接使用$GOROOT所以不再设定。

现在我们安装第三方依赖库，例如`code.google.com/p/mahonia`编码库。

	cd ~/go/src/pkg
	hg clone https://code.google.com/p/mahonia/ code.google.com/p/mahonia
	go install code.google.com/p/mahonia

同样，执行后我们可以在`~/go/pkg/windows_386/`找到编译好的`code.google.com/p/mahonia.a`库文件。
如果使用到windows资源文件，还需要安装[GNU Binutils windres](https://sourceware.org/binutils/),请下载源码包并使用`configure --enable-targets=all`模式安装。 
至此，我们的交叉编译环境就搭建好了，编译过程跟普通编译一样，make就好。


