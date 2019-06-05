---
layout: post
title: "定制自己的Eclipse"
description: ""
category: JAVA
tags: [eclipse]
---
由于之前用的Juno for Java EE 实在是太耗内存，启动就要800多M，随便就过G了，于是决定自己配置个精简版的eclipse使用。 
下载 Eclipse Platform <http://archive.eclipse.org/eclipse/downloads/> 手工安装各种插件 

	#以下通过http://download.eclipse.org/releases/juno安装  
	Eclipse Java Development Tools  #java开发必须  
	Eclipse Java EE Developer Tools  #java ee开发必须  
	Eclipse Platform  #runtime平台  
	Eclipse Web Developer Tools  #JST Server依赖此插件  
	Eclipse XML Editors and Tools  #XML编辑  
	FindBugs Feature   #代码检查  
	JST Server Adapters  #Server Adapters，用tomcat调试必须  
	JST Server Adapters Extensions  #同上  
	Marketplace Client  #有了这个装插件就方便多了  
	
	#以下通过Marketplace 安装  
	Eclipse Explorer  
	Eclipse EGit   #git工具  
	Subclipse (Required)  #svn工具  
	Subclipse Integration for Mylyn 3.x (Optional)  
	Subversion Client Adapter (Required)  
	Subversion JavaHL Native Library Adapter  
	Subversion Revision Graph  
	SVNKit Client Adapter  
	CollabNet Merge Client  

这些组件已经可以完成日常开发，启动后内存只有350M，速度飞快。 


如果安装完成之后出现了java代码不能自动完成的问题，请按如下方法设置： 

1、进入window->Preferences->Java->Editor->Content Assist->Advanced 

2、在上面的选项卡 Select the proposal kinds contained in the 'default' content assist list: 中 
把 "Java Non-Type Proposals" 选项打上勾即可