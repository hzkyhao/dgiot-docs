---
layout: post
title: "搭建Cisco IPSec VPN服务"
description: ""
category: VPN
tags: [debian, IPSec, vpn]
---
上一篇介绍了pptp协议的vpn搭建，本篇主要介绍Cisco IPSec，这也是iOS和android上原生支持的VPN协议。IPSec可以提供加密的安全ip隧道，在Linux上对应的实现主要有strongSwan、Openswan和racoon三种。strongSwan已经停止维护，现在已经很少用了。下面以racoon为例介绍IPSec的配置使用。

1. 安装racoon
---
下面的apt-get安装和编译安装选择一种即可，推荐apt-get。
### 使用apt-get安装racoon
为了使用最新版的racoon，我们需要给debian加上testing源。testing版相对于稳定版测试没那么充分，但一般使用是没有问题的，软件往往新很多。  
#### 编辑源列表
	
	vi /etc/apt/sources.list
	
后面添加testing源

    deb http://ftp.debian.org/debian testing main non-free contrib
    deb http://ftp.debian.org/debian testing-proposed-updates main non-free contrib
    deb http://security.debian.org/ testing/updates main non-free contrib
    
    deb-src http://ftp.debian.org/debian testing main non-free contrib
    deb-src http://ftp.debian.org/debian testing-proposed-updates main non-free contrib
    deb-src http://security.debian.org/ testing/updates main non-free contrib

#### 更新源列表

	apt-get update
	apt-get upgrade

#### install racoon

    apt-get install racoon

### 编译安装racoon
去<http://ipsec-tools.sourceforge.net/>下载[最新版本的racoon源码](http://sourceforge.net/projects/ipsec-tools/files/latest/download?source=files)

    wget http://downloads.sourceforge.net/project/ipsec-tools/ipsec-tools/0.8.1/ipsec-tools-0.8.1.tar.bz2
    tar xvf ipsec-tools-0.8.1.tar.bz2
    cd ipsec-tools-0.8.1
    ./configure --enable-security-context=no --with-kernel-headers=/usr/include
    make && make install
由于racoon依赖很多包，`configure`很可能会遇到问题，我参考了<http://notes.benv.junerules.com/ipsec-tools-and-slackware64/>

2. 配置racoon
---
首先使用下面的配置替换`/etc/racoon/racoon.conf`
		
	log info;
	path include "/etc/racoon";
	path pre_shared_key "/etc/racoon/psk.txt";
	
	listen {
		isakmp 1.2.3.4 [500]; #监听的端口和地址
		isakmp_natt 1.2.3.4 [4500]; #监听的端口和地址
	}
	
	remote anonymous {
	    exchange_mode main,aggressive;
	    doi ipsec_doi;
	    nat_traversal on;
	    proposal_check obey;
	    generate_policy unique;
	    ike_frag on;
	    passive on;
	    dpd_delay = 30;
	    dpd_retry = 30;
	    dpd_maxfail = 800;
	    mode_cfg = on;
	    proposal {
	        encryption_algorithm aes;
	        hash_algorithm sha1;
	        authentication_method xauth_psk_server;
	        dh_group 2;
	        lifetime time 12 hour;
	    }
	}
	
	timer{
	    natt_keepalive 20 sec;
	}
	
	sainfo anonymous {
	    lifetime time 12 hour;
	    encryption_algorithm aes,3des,des;
	    authentication_algorithm hmac_sha1,hmac_md5;
	    compression_algorithm deflate;
	}
	
	mode_cfg {
	    dns4 8.8.8.8,8.8.4.4;
	    save_passwd on;
	    network4 192.168.33.254; #客户端IP
	    netmask4 255.255.255.0;
	    pool_size 250;
	    banner "/etc/racoon/motd";
	    auth_source pam;
	    conf_source local;
	    pfs_group 2;
	    default_domain "local";
	}

修改 `/etc/racoon/psk.txt`

    * secret_word  #前面是Group Name,后面是Secret,对应客户端里面的IPSec识别符和IPSec预共享密钥

这样IPSec就配置完成了，登陆的用户即是系统用户，可以使用useradd添加。  

客户端在iOS中使用Cisco IPSec配置，android中使用IPSec Xauth PSK配置。

### 参考：

<http://blog.ti.io/2011/10/cisco-ipsec-vpn-howto/>  
<http://blog.wellsgz.info/?p=1964>  
<https://w3.owind.com/pub/linux-cisco-vpn-server-for-dummies/>
