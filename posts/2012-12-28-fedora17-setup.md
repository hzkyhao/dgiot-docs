---
layout: post
title: "fedora17一些常见配置"
description: ""
category: Linux
tags: [fedora17]
---
fedora17跟之前版本配置有些差异，纪录在此以备查找。

###1. 修改启动模式 

设置默认启动无图形界面多用户 
	ln -sf /lib/systemd/system/multi-user.target /etc/systemd/system/default.target  

设置默认启动带图形界面多用户 
	ln -sf /lib/systemd/system/graphical.target /etc/systemd/system/default.target  

参考：<http://planet.linuxdeepin.com/2012/08/09/tools-and-tips-for-systemd-1/>


###2. 启动时显示cannot open font file true的解决办法 

 - 打开`/etc/default/grub` 文件,将`GRUB_CMDLINE_LINUX=`这行中的`SYSFONT=True` 改为`SYSFONT=latarcyrheb-sun16` ； 
 - 运行命令：`grub2-mkconfig -o /boot/grub2/grub.cfg`
 - 最后reboot；问题即可解决。 

参考：<http://forums.fedoraforum.org/showthread.php?t=277213> 


###3. 添加新的yum镜像地址 
参考：<http://mirrors.163.com/.help/fedora.html> 

###4. 安装32位libc 

	yum install libgcc.i686 glibc.i686  


###5. 删除默认的openJDK 

	yum erase java-1.7.0-openjdk.x86_64  


###6. 启动SSH服务 

	systemctl start sshd.service  


###7. 随系统一起启动服务 

	systemctl enable sshd.service  


###8. 默认开通22端口 
创建`/etc/rc.d/rc.local`文件，内容为 

	#!/bin/sh  
	iptables -I INPUT -p tcp --dport 22 -j ACCEPT  

执行`chmod +x /etc/rc.d/rc.local`赋予执行权限即可 

参考：<http://www.sungyism.com/blog/post/159/>
