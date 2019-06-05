---
layout: post
title: "终端界面下乱码的解决"
description: ""
category: Linux
tags: [terminal, codeset]
---
大家都知道乱码就是字符集设置问题，所以我们需要清楚关于字符集的几个概念。

- **GB2312**：早期的中文字符集国标，字库很小，不建议使用。
- **GBK**：微软为弥补gb2312的不足搞出来的大字符集，是gb2312的超集，也是windows默认的字符集，几乎是事实标准。
- **GB18030**：大字符集的国标，比GBK多一些字，但在编码定义上与GBK有少许不同，一般可以认为他们是兼容的。
- **IBM-eucCN**：IBM的中文字符集，AIX默认，与GBK基本兼容，但字要少一点。
- **UTF8**：最全的字符集，用这个任何生僻字都可以处理，推荐使用。
- **CP936**：Code Page 936，windows内中文语言的代码页，早期被映射到gb2312，现在被映射到gbk。

下面我们以编辑一个utf8文件为例，说明跟字符集设置相关的因素。
要处理utf8文件，那么在读写的所有环节我们都应该使用utf8，避免程序自动转码出现乱码。

1. 设置当前环境字符集为UTF8 

	首先使用`locale charmap`命令检查当前字符集。如果不是utf8则用`locale -a`列出系统当前可用字符集，找到包含utf8的那一项，例如ZH_CN.UTF-8，然后`export LANG=ZH_CN.UTF-8` 修改LANG的环境（注意区分大小写），然后用`locale charmap`命令再次检查，多数情况下这样就ok了。
如果字符集没有改过来或变成了其他的，使用locale命令检查详细的语言设置，这时会发现LC_ 开头的一些环境变量不是utf8，手工unset或export为utf8.

2. 设置终端软件的字符集
	
	a) **Putty**： window → Translation → Remote character set 改为 UTF-8，也可以保存在session里面。
	
	b) **Xshell**：Terminal → Translation → Encoding 改为 UTF-8，也可以通过工具栏上的 Encoding 图标快速切换，
推荐大家使用xshell作为终端。
	
	c) **SecureCRT**：Terminal → Appearance → character encoding 改为UTF-8.
这时我们已经可以通过cat查看utf8文件或者通过 cat > testfile 写入utf8数据到文件里面。
但如果通过vim编辑，还需要修改vim的环境变量。
 
3. VIM的设置

	`vim ~/.vimrc` ,设置 `set fileencodings=utf-8` (指定vim以utf8编码打开文件) 和 `set encoding=utf-8` (指定vim以utf8编码输出到终端)

这样我们就可以使用vim编辑utf8文件了，其他字符集也与这类似。但是每次修改这些比较麻烦，如果不包含生僻字，我们可以用`iconv -f UTF-8 -t GB18030 filename` 将utf8文件转换成gb18030处理。
 
**注意**：

1、iconv并不依赖操作系统的字符集，iconv能支持的字符集可以通过`iconv -l`命令查看。

2、java程序也不依赖操作系统的字符集，jvm能支持的字符集可通过Charset.availableCharsets()方法查看。
