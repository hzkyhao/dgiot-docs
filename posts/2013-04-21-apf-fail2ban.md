---
layout: post
title: "使用apf和fail2ban保护Linux"
description: ""
category: Linux
tags: [debian, apf, fail2ban]
---
部署在公网上的服务器随时都会受到各种攻击，我们可以使用apf做网络防火墙，配合fail2ban防止ssh暴力破解。

1. APF的安装配置
---
APF本身只是一些脚本，通过一些简单的规则自动配置iptables，实现防火墙功能，安装上非常简单。

	wget http://www.rfxnetworks.com/downloads/apf-current.tar.gz
	tar -xvzf apf-current.tar.gz
	cd apf-*
	./install.sh
	
安装成功后会显示当前监听端口的情况。下面修改apf的配置文件`vi /etc/apf/conf.apf`

	IFACE_IN="eth1"                    #设置过滤的网络接口
	IFACE_OUT="eth1"                   #一般跟IFACE_IN相同
	IG_TCP_CPORTS="22,80,443,3306"     #设置服务器允许被访问的TCP端口
	IG_UDP_CPORTS="53"                 #设置服务器允许被访问的UDP端口
	EGF="1"                            #开启出站过滤
	EG_TCP_CPORTS="21,25,80,443,43"    #设置服务器允许对外访问的TCP端口
	EG_UDP_CPORTS="20,21,53"           #设置服务器允许对外访问的UDP端口  
	DEVEL_MODE="0" #当验证配置无问题后修改此参数值为0，值为1时apf会在5分钟后自动回滚配置

如果只允许特定主机访问，可以如下配置：

	//在/etc/apf/allow_hosts.rules添加如下信息
	tcp:in:d=22:s=1.2.3.4
	out:d=22:d=1.2.3.4
	
	//在/etc/apf/deny_hosts.rules添加如下信息
	tcp:in:d=22:s=0/0
	out:d=22:d=0/0

最后重启apf防火墙 `apf -r`，直接输入`apf`可以看到使用帮助。

2. fail2ban的安装配置
---
fail2ban的安装也很简单，debian下直接`apt-get install fail2ban`即可。安装好之后可以在`/etc/fail2ban/filter.d`看到用于匹配各种服务日志的规则。  
修改fail2ban的主配置文件`vi /etc/fail2ban/jail.conf`

	[DEFAULT]       #全局配置信息
	bantime  = 600  #默认屏蔽时间
	maxretry = 3    #默认3次失败后屏蔽
	
	[ssh]
	enabled = true  #ssh防护是默认启动的
	port    = ssh
	filter  = sshd
	logpath  = /var/log/auth.log
	maxretry = 6    #根据需要修改失败屏蔽次数
	
根据需要启动保护的服务，然后重启fail2ban：
	
	service fail2ban restart
	
最后验证fail2ban是否运行正常：

	fail2ban-client status
	
