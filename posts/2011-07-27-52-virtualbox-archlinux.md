---
layout: post
title: "virtualBox下安装archlinux"
description: ""
category: Linux
tags: [virtualBox, archlinux]
---
这两天折腾archlinux，遇到一些问题，记录下来以备查验。

1. archlinux在163有镜像，速度很快，推荐使用。pacman的镜像配置可以参考<http://mirrors.163.com/.help/archlinux.html>
2. 配置好pacman之后推荐立即安装yaourt，yaourt提供了海量软件库，大部分软件都可以在yaourt找到，操作命令跟pacman类似，带有语法加亮。安装可以参考[https://wiki.archlinux.org/index.php/Yaourt_(简体中文)](https://wiki.archlinux.org/index.php/Yaourt_\(简体中文\)) ，archlinux的大部分问题也都可以在wiki找到答案。
3. 安装X需要virtualBox专用显卡驱动，是由社区提供的，参考 <https://wiki.archlinux.org/index.php/VirtualBox>。一开始我试图在VirtualBox的官网找这个驱动，结果浪费了很长时间，没看wiki的害处啊。
4. 配置中文字符集，可以用localedef命令或者参考[https://wiki.archlinux.org/index.php/Locale_(简体中文)](https://wiki.archlinux.org/index.php/Locale_\(简体中文\))使用locale-gen.

		$localedef -f 字符集 -i locale定义文件 生成的locale的名称
		例如	
		$localedef -f UTF-8 -i zh_CN zh_CN.UTF-8