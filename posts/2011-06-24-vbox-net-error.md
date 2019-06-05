---
layout: post
title: "VirtualBox虚拟网卡错误修复"
description: ""
category: Linux
tags: [virtualBox]
---
这两天因为安装的winpkFilter导致VirtualBox的虚拟网卡没法正常工作了。首先想到是winpk的问题，卸载后问题依旧。在NTKR上找到一篇文章介绍手工彻底删除winpkFilter(<http://www.ntkernel.com/forum/viewtopic.php?f=2&t=5180&p=8271>)

> "All instances are removed from both Windows\INF and Windows\System32\DriverStore\FileRepository using the pnputil.exe shipped with Windows。After you think that you have uninstalled and removed WinpkFilter driver I would also check if registry key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\ndisrd still exists. Sometimes uninstall does not remove this key."

可是VirtualBox的问题更严重了，报如下错误。
	
	返回 代码:
	NS_ERROR_FAILURE (0x80004005)
	组件:
	Machine
	界面:
	IMachine {662c175e-a69d-40b8-a77a-1d719d0ab062}

根据网上的方法（<http://www.cnblogs.com/leipei2352/archive/2011/03/13/1982792.html>）重装VirtualBox\drivers\vboxdrv顺利解决。
问题不麻烦却折腾了我一下午，主要是总在winpkFilter上找原因，没考虑是VirtualBox的问题，最近做事太想当然了。