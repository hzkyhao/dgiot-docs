---
layout: post
title: "备份迁移Discuz! X2.5"
description: ""
category: Linux
tags: [Discuz!]
---
前两天迁移一个Discuz!站点，总的来说很顺利。使用ftp备份所有文件，进入phpmyadmin导出整个数据库，我使用SQL insert模式，比较通用。在新主机上修改以下数据库配置文件
		
		config/config_global.php
		config/config_ucenter.php
		uc_server/data/config.inc.php

在新服务器上也使用phpmyadmin导入数据，如果导入的时候界面上提示*"最大限制：2,048 KB"*,请修改php服务器的配置文件`php.ini`,将`upload_max_filesize = 2M`设成需要的大小。  

启动新服务器，这个时候应该可以在本地访问测试新站点了，如果遇到 `301 Moved Permanently` 错误，总是重定向到旧网站，可以删除 `data/sysdata/cache_domain.php` 缓存文件。