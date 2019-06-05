---
layout: post
title: "在debian上搭建基于pptp的vpn服务"
description: ""
category: Linux
tags: [debian, pptp, vpn]
---
**PPTP**（点对点隧道协议）可以在IP网络上建立PPP会话隧道，是非常常见并且通用性比较好的VPN协议。虽然PPTP因为使用1723端口和47端口的**GRE**协议，导致很容易被拦截，但部署方便，在多数时候也能获得不错速度，多一种选择总是好的。

1. 安装pptp
---
得益于debian强大的apt-get，安装几乎是一键试的。

	apt-get install pptpd ppp dkms
如果看到pptpd启动成功，说明已经安装成功了。redhat的安装可以参考[Redhat Linux 5.3 PPTP VPN Server的安装配置](http://viong.blog.51cto.com/844766/276025)。

2. 配置pptp
---
### 设置pptpd.conf
修改`/etc/pptpd.conf`设置localip和remoteip，避免和已有网段冲突，其他的可以使用默认参数
	
	option /etc/ppp/pptpd-options
	logwtmp   #使用wtmp记录连接日志
	#debug    #将debug信息记入系统日志/var/log/messages
	#stimeout 120  #开始PPTP控制连接的超时时间，以秒计
	localip 192.168.33.1  #服务器的地址
	remoteip 192.168.33.2-238  #远程客户端的地址范围

### 设置pptpd-options
修改`/etc/ppp/pptpd-options`设置dns服务器地址，其他使用默认参数
	
	name pptpd	#pptpd server 的名称。
	refuse-pap	#拒绝 pap 身份验证模式。
	refuse-chap	#拒绝 chap 身份验证模式。
	refuse-mschap		#拒绝 mschap 身份验证模式。
	require-mschap-v2	#在端点进行连接握手时需要使用微软的 mschap-v2 进行自身验证。
	require-mppe-128   #MPPE 模块使用 128 位加密。
	ms-dns 8.8.8.8
	ms-dns 8.8.4.4   #ppp 为 Windows 客户端提供 DNS 服务器 IP 地址，第一个 ms-dns 为 DNS Master，第二个为 DNS Slave。
	proxyarp   #建立 ARP 代理键值。
	#debug   #开启调试模式，相关信息同样记录在 /var/logs/message 中。
	lock    #锁定客户端 PTY 设备文件。
	nobsdcomp   #	禁用 BSD 压缩模式。
	#novjccomp   #禁用 Van Jacobson 压缩模式
	#nologfd    #禁止将错误信息记录到标准错误输出设备(stderr)

### 设置chap-secrets
`/etc/ppp/chap-secrets`文件指定了ppp连接认证需要的用户名和密码，每行一条记录。

	# client	server	secret			IP addresses
	username   *     passwd       *
至此pptp已经配置完成，`service pptpd restart`重启pptpd服务，客户端应该已经可以连接。如果不能连接请检查防火墙tcp 1723(pptpd)和47(GRE)端口是否放通。

3. 配置NAT转发服务
---
客户端通过pptp协议拨入服务器后并不能立即上网，我们还需要将服务器配置为NAT代理，供客户端上网。这个可以用iptables实现：

	iptables -t nat -A POSTROUTING -s 192.168.33.0/24 -j SNAT --to 1.2.3.4  ＃1.2.3.4是你服务器的对外出口地址
	＃或者 iptables -t nat -A POSTROUTING -o ppp1 -j MASQUERADE
  
