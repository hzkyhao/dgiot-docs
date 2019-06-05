---
layout: post
title: "基于node.js的简单代理"
description: ""
category: nodejs
tags: [nodejs, proxy]
---
一直在用iptables进行代理转发，效率很高，但是linux的内核似乎不是很稳定，`/proc/net/nf_conntrack`中看到的连接常常是已经挂死的。而且linux下也没有类似rmsock的命令清理连接。这两天看node.js，发现这是个做代理的好工具，实现非常简单，总共40行代码搞定。
	
```javascript
var net = require('net'), util=require('util');
var proxyhost="192.168.0.1";
var proxyport=8080;
var listenport=8080;

var server = net.createServer(function (socket) {
	var ip = socket.remoteAddress;
	util.log('connect from '+ ip);
	
	socket.on("connect",function(){
		try{
			var db=net.createConnection(proxyport,proxyhost);
			db.pipe(socket);
			socket.pipe(db);
			socket.on("close",function(){
				//      util.log("server closed");
				db.destroy();
			});
			socket.on("error",function(){
				util.log("server closed");
				db.destroy();
			});
			db.on("error",function(data){
				util.log("conn error:"+data);
				socket.destroy();
				db.destroy();
			});
			db.on("end",function(){
				// util.log("conn end");
				socket.destroy();
			});
			db.on('close',function(){
				// util.log("conn close");
			});
		}catch(err){
			util.log(err);                    
		}
	});
});
server.listen(listenport, "0.0.0.0", function(){
	console.log('porxy start on %j ', server.address());
});
```