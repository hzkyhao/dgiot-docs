---
layout: post
title: "Apache2.2 HTTPS反向代理配置"
description: ""
category: Apache
tags: [apache, reverse proxy]
---
## 第一步：建立一个 CA 的证书
首先为 CA 创建一个 RSA 私用密钥，  
[S-1] `openssl genrsa -des3 -out ca.key 1024`
(由于windows系统下的ssl_module不支持加密密钥，使用opensslgenrsa -out ca.key 1024)
系统提示输入 PEM pass phrase，也就是密码，输入后牢记它。
生成 ca.key 文件，将文件属性改为400，并放在安全的地方。  
[S-2] `chmod 400 ca.key`   
你可以用下列命令查看它的内容，  
[S-3] `openssl rsa -noout -text -in ca.key`
 
利用 CA 的 RSA 密钥创建一个自签署的 CA 证书（X.509结构）  
[S-4] `openssl req -new -x509 -days 3650-key ca.key -out ca.crt`
然后需要输入下列信息：  
	
	Country Name: CN 两个字母的国家代号
	State or Province Name: Guangdong 省份名称
	Locality Name: Guangzhou 城市名称
	Organization Name: 公司名称
	Organizational Unit Name:  部门名称
	Common Name:  你的姓名
	Email Address:  Email地址
生成 ca.crt 文件，将文件属性改为400，并放在安全的地方。  
[S-5] `chmod 400 ca.crt`   
你可以用下列命令查看它的内容，  
[S-6] `openssl x509 -noout -text -in ca.crt`
 
 
## 第二步：创建服务器证书签署请求
首先为你的 Apache 创建一个 RSA 私用密钥:  
[S-7] `openssl genrsa -des3 -out server.key1024` 
(同上windows下使用opensslgenrsa -out server.key 1024)
这里也要设定pass phrase。  
生成 server.key 文件，将文件属性改为400，并放在安全的地方。  
[S-8] `chmod 400 server.key`  
你可以用下列命令查看它的内容，  
[S-9] `openssl rsa -noout -text -inserver.key `
 
用 server.key 生成证书签署请求 CSR.   
[S-10] `openssl req -new -key server.key-out server.csr` 
这里也要输入一些信息，和[S-4]中的内容类似。
至于 'extra' attributes 不用输入。
“Common Name: Chen HM 你的姓名”这条信息请你输入你的服务器的域名或者IP地址，
你可以查看 CSR 的细节  
[S-11] `openssl req -noout -text -inserver.csr` 
 
## 第三步：签署证书
需要用到脚本 sign.sh   
[S-12] `./sign.sh server.csr` 
就可以得到server.crt。
如果没有sign.sh也可以用以下命令签名  
`openssl ca -config openssl.cnf -days 3650-cert ca.crt -keyfile ca.key -in server.csr -out server.crt`  
注意需要手动创建一个CA目录结构  
	
	└─ssl
    	├─newcerts
    	├─index.txt
    	├─serial
在demoCA中建立 index.txt 空文件, serial文件 , serial文件中可输入01
否则运行这个命令会出错：I am unable to access the ./demoCA/newcerts directory....
 
将文件属性改为400，并放在安全的地方。  
[S-13] `chmod 400 server.crt`   
删除CSR   
[S-14] `rm server.csr `
 
## 最后apache设置
修改httpd.conf  
去掉Include conf/extra/httpd-ssl.conf 这一行的注释  
修改httpd-ssl.conf  
在<VirtualHost>中增加以下内容  
```xml
<VirtualHost>
# 原有内容保留，增加以下内容
# 声明ssl代理引擎
SSLProxyEngine on
# 这里声明代理的URL转换处理
# 注意需要使用域名，否则证书、用户页面的URL会有问题
	ProxyPass / https://yourdomain:443/
	ProxyPassReverse / https:// yourdomain:443/
</VirtualHost>
```
 sign.sh的内容如下：
 ```bash
#!/bin/sh
##
##  sign.sh -- Sign a SSL Certificate Request (CSR)
##  Copyright (c) 1998-2001 Ralf S. Engelschall, All Rights Reserved. 
##

#   argument line handling
CSR=$1
if[$#-ne1]; then
echo"Usage: sign.sign <whatever>;.csr"; exit1
fi
if[!-f$CSR]; then
echo"CSR not found: $CSR"; exit1
fi
case$CSRin
*.csr )CERT="`echo $CSR | sed -e 's/\.csr/.crt/'`";;
*)CERT="$CSR.crt";;
esac

#   make sure environment exists
if[!-d ca.db.certs ]; then
mkdir ca.db.certs
fi
if[!-f ca.db.serial ]; then
echo'01'> ca.db.serial
fi
if[!-f ca.db.index ]; then
cp/dev/null ca.db.index
fi

#   create an own SSLeay config
cat> ca.config <<EOT
[ ca ]
default_ca              = CA_own
[ CA_own ]
dir                     = .
certs                   = \$dir
new_certs_dir           = \$dir/ca.db.certs
database                = \$dir/ca.db.index
serial                  = \$dir/ca.db.serial
RANDFILE                = \$dir/ca.db.rand
certificate             = \$dir/ca.crt
private_key             = \$dir/ca.key
default_days            = 365
default_crl_days        = 30
default_md              = md5
preserve                = no
policy                  = policy_anything
[ policy_anything ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional
EOT

#  sign the certificate
echo"CA signing: $CSR -> $CERT:"
../bin/openssl ca -config ca.config -out$CERT-infiles$CSR
echo"CA verifying: $CERT <-> CA cert"
../bin/openssl verify -CAfile  ca.crt  $CERT

#  cleanup after SSLeay 
rm-f ca.config
rm-f ca.db.serial.old
rm-f ca.db.index.old

#  die gracefully
exit0
```