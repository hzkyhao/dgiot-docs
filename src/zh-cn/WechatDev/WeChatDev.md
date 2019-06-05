title:  微信应用开发教程
---
# 微信SDK
附件：[微信SDK包下载](https://github.com/gizwits/gizwits-wechat-js-sdk)

# 目标驱动的教程
本教程以目标为驱动，去除多余的细节，让机智云的小伙伴们，可以快速的搞定微信接入。好啦，我们开始吧！

# 为什么接入微信？

- 微信有大量的用户

- 用户不愿意，为某个垂直领域的服务，单独装一个应用

- 微信有全平台的版本，开发一次，相当于开发多个应用

等等……

正是这些好处，我们才会借助微信的力量。所以，我们将借助微信的两大体系: 

- 用户体系（OpenId）

- 微信APP（AirKiss 和 内置浏览器）。

最终，我们希望用户，能像体验微信原生功能一样，使用我们的智能设备。

# 你有微信公众号?

首先，我们需要申请微信公众号。

注意，不能申请订阅号（不支持微信认证）。我们将申请一个服务号，并且完成认证操作，然后才能开启“设备功能”模块，最后添加一个产品。

最终，你会得到两件装备：

-  公众号的原始ID

-  设备的二维码

当然，你也可以使用测试号，进行前期开发阶段的调试。

# 你得有台设备吧？

微信接入前，需保证，设备能正常地与机智云进行通讯，设备的具体开发流程如下。

![Alt text](/assets/zh-cn/WechatDev/wechat_02.png)

 注意，在WIFI模块中，写入AirKiss时，需要配置公众号的原始ID。也就说，除了将机智云的product_key写入MCU以外，还需要将公众号原始ID写入WIFI固件中。关于固件的烧录，厂商或者小伙伴们如有困难，可以寻求机智云 · 客服MM的帮助。

# 设备二维码

微信客户端APP可以通过扫描二维码添加设备。为使已成功接入机智云的设备能被微信控制，在微信公众平台创建产品的时候请按照以下设置来勾选。设置内容如下：

![Alt text](/assets/zh-cn/WechatDev/wechat_03.png)

其中：连接类型选择“Wi-Fi”设备；

产品添加方式选择“每种型号唯一的二维码”，产品添加成功后，微信会生成此款产品的唯一一个二维码，通过扫描这个唯一的二维码可以进行微信配网后近场发现设备来绑定，如果选择“每个产品唯一的二维码”，那么将会为此款产品的每一个产品生成一个二维码，扫描该二维码可以直接绑定设备，但是无法通过近场发现绑定；

产品配置方式选择“微信配网”与“不使用加密”。


# 设备授权

设备不但要在WIFI固件中写入公众号原始ID(注意，不是APPID)，还要将所有设备的Mac地址，登记到微信服务器上。一开始，微信只给你100个配额，也就是说，你只能授权100个设备。

授权的方法，就是向微信的接口，发送一次请求，具体请看微信文档-设备授权。

很多小伙伴反应，授权经常失败，我们这里给出一组基于WIFI通讯的示例，大家可以参考：

![Alt text](/assets/zh-cn/WechatDev/wechat_04.png)

 注意：12位xxxxxxxxxxxx，代表设备的Mac地址，id是指设备ID，也就是机智云的did。但因为设备必须在上线后，机智云才会分配一个did，所以，我们并无法预知did是什么。通常的做法是：将id和mac，都设置为设备的Mac值。

auth_key可以不填，设置为空字符串，但不能没有这个字段。

op_type为0时，表示添加一台设备，后面需要跟着product_id字段(产品ID，在公众号的“设备功能”中，添加产品后，会有这个id)。op_type为1时，表示更新一台设备，此时不需要product_id字段。

批量授权时，记得更新顶部的：device_num。

这样，我们硬件（设备）层面的准备工作，就完成啦。

# 阶段性成果

好了，到这步，你可以稍微的奖励一下自己，享受一下阶段性的成果啦! 

打开你的微信（确保是wifi链接状态），扫一扫你的产品二维码。

![Alt text](/assets/zh-cn/WechatDev/wechat_05.jpg)

下面有两个按钮，绿色的按钮，是启动微信的AirKiss，将WIFI的账号密码，发送给设备的WIFI模块。

部分设备需要启动匹配模式，才能配置上网。一般先启动设备的匹配模式，再使用微信的配置功能。配置完成后，会自动跳转到设备搜索界面。

在搜索界面，如果前面准备工作到位了，你一定能发现设备（不管是否绑定过）。点击发现的设备，然后绑定。微信会自动跳转到公众号页面。然后，你可以在微信的设置页面中，发现多了一个项目：设备。

当然，上面的操作，只是实现绑定操作。下面的教程将介绍如何监控设备的数据点。

# 简化操作的SDK

为了简化开发者的操作，我们将一些必要的API封装成了两个SDK: java-SDK 以及 js-SDK。它们分别用于后台和前端页面，各自封装了机智云的OpenAPI 以及 WebSocket。

这两个SDK，将大大的简化了API的操作，帮我们接管了token和用户管理，我们只需要调用相关方法，即可实现设备的绑定和解绑。

SDK，可以在本文的附件中下载。

# 业务服务器的搭建

设备没问题了，我们现在需要的是，操控设备本身的功能。

由于设备已经与机智云正常的通讯，因此，对设备的操作，其实就是如何与机智云交互。

# 机智云设备绑定

现在，用户已经在微信中绑定了设备，他希望看到，设备在线状态。怎么办?

我们使用微信的OpenId，作为唯一标识，生成匿名用户。什么时候注册匿名用户呢？微信绑定设备时候，将推送一条设备绑定事件消息到我们的业务服务器。我们在这个时候，将同时完成注册匿名用户，以及绑定用户/设备的操作。

![Alt text](/assets/zh-cn/WechatDev/wechat_06.jpg)

微信在绑定时，发送这么一条事件消息：

![Alt text](/assets/zh-cn/WechatDev/wechat_6.5.png)

我们需要的是其中的OpenID和Mac，然后我们调用机智云的Java-SDK：

```java
DeviceInfo deviceInfo = OpenApi.bindDevice(
                                    wechatOpenId, 
                                    gizwitsAppId, 
                                    gizwitsProductKey, 
                                    gizwitsProductSecret, 
                                    mac, 
                                    deviceAlias, 
                                    deviceRemark)
```
| 参数名       | 类型          |             说明           | 
| ------------- |:-------------:|    -------------    |  
| wechatOpenId     | String | 微信中的OpenId，也就是机智云中注册的匿名用户| 
| gizwitsAppId    | 	String     |  机智云产品所绑定的APP的id| 
| gizwitsProductKey| String	| 机智云的产品key| 
| gizwitsProductSecret	| String	| 机智云的产品Secret| 
| mac	| String	| 设备的Mac地址| 
| deviceAlias	| String	| 设备的别名| 
| deviceRemark	| String	| 设备的备注| 
 
 这个方法，一次性解决了两个问题：注册匿名用户，绑定用户/设备。相对的，也要设定很多参数。所有的参数都是String类型。

其中deviceAlias（设备别名）以及deviceRemark（设备备注）都可以填空字符串“”。gizwitsProductKey就是你在开发者中心创建的产品。


![Alt text](/assets/zh-cn/WechatDev/wechat_07.jpg)

而gizwitsProductSecret，则是该产品对应的密匙，在产品的详细信息中可以找到。

![Alt text](/assets/zh-cn/WechatDev/wechat_08.jpg)

gizwitsAppId是机智云中，APP的Id。由于一个产品，可能是多个APP操作的，比如IOS的APP，Android的APP，网站Web应用，甚至微信这样的轻应用，都算是一个APP。因此，在创建产品后，你还可以在为产品绑定一个或多个APP。这里的gizwitsAppId就是我们所绑定APP的Id了。注意，APP必须绑定在产品上，才能使用。

当你调用该方法，就能实现注册匿名用户，已经将用户/设备绑定的操作了。是不是很方便呢？当然，为了方便起见，你还可以进一步封装这个SDK。这里就不展开了。

# 机智云设备解绑

解绑操作也是类似的逻辑。当微信推送一条解绑事件消息，我们就会进行解绑操作。同样调用SDK：

```java
Boolean isSuccess = OpenApi.unbindDevice(wechatOpenId, gizwitsAppId, gizwitsDid);
```

| 参数名       | 属性          |             说明           | 
| ------------- |:-------------:|    -------------    |  
| WechatOpenId	| String	| 微信中的OpenId，也就是机智云中注册的匿名用户| 
| gizwitsAppId	| String	| 机智云产品所绑定的APP的id| 

# 获知设备的在线状态

```java
Boolean isOnline = OpenApi.getDeviceOnlineStatus(wechatOpenId, gizwitsAppId, gizwitsDid);
```

| 参数名       | 属性          |             说明           | 
| ------------- |:-------------:|    -------------    |  
  |  wechatOpenId	  |  String	  |  微信中的OpenId，也就是机智云中注册的匿名用户
  |  gizwitsAppId	  |  String	  |  机智云产品所绑定的APP的id
  |  gizwitsDid	  |  String	  |  机智云中的设备ID，设备重置时会重新注册

# 代码样例

![Alt text](/assets/zh-cn/WechatDev/wechat_09.png)

请注意，在服务器部署的时候，部分开发者会发现部署失败。tomcat中的catalina日志会报错：

```java
javax.net.ssl.SSLException:java.security.ProviderException:java.security.KeyException
```
这是因为SDK中采用了Https的方式进行访问。

解决方法是：升级服务器环境中的库：nss。

# 微信页面操作设备

好了，我们现在已经绑定了设备，并且也能知道设备的在线的状态了。但是具体如何操作我们的设备？一个良好的体验，当然是具有交互页面的。
下面我们就一步步的搭建一个交互页面，来监控我们的设备吧！

# 获取OpenId

用户点击页面，我们如何知道是哪个用户呢？我们需要获取当前用户的OpenId来识别时哪个用户。如何获取呢？详细可以看微信的官方文档。

简单的来说，我们向微信的服务器发送授权请求，微信会判断我们请求的URL，是否是授权的域名，如果验证通过，就会转发到我们的URL，并且带上几个参数。

其中最重要的参数，是code，我们通过Code可以获取OpenId。然后，我们再将OpenId返回到页面中。

![Alt text](/assets/zh-cn/WechatDev/wechat_10.png)

# 连接机智云的WebSocket

对于访问机智云的WebSocket，我们已经封装成了一个JS-SDK。大家只需要引入到页面即可。

# 初始化gizwits服务

首先是，构建一个gizwits服务：

![Alt text](/assets/zh-cn/WechatDev/wechat_11.png)

 这个gizwits服务，会负责接下来所有的操作，包括：连接设备，读取设备的数据点，操作设备等。

| 参数名       | 属性          |             说明           | 
| ------------- |:-------------:|    -------------    |  
| ApiHost	| String	| websocket的目标API域名
| CommType	| String	| 协议格式：custom(自定义协议); attrs_v4(标准数据点协议)
| wechatOpenId	| String	| 当前访问的微信用户OpenId
| GizwitsAppId	| String	| 机智云产品所绑定的APP的id

当然，此时gizwits服务，并没有运行起来，我们还需要初始化操作。但在操作之前，我们可以选择配置一个回调函数，它会在初始化结束后，自动运行。

![Alt text](/assets/zh-cn/WechatDev/wechat_12.png)

当执行gizwits.init()的时候，就会初始化gizwits服务，并且将匿名用户OpenId绑定的所有设备，放置在回调函数的devices中。

而我们要做的操作，都应该写在回调函数gizwits.onInit里面。

devices列表中的每个设备，都会有六个属性，分别是product_key(产品的Key), dev_alias(设备别名），did(设备ID)，mac，is_online(在线状态）, remark(设备备注)。我们可以根据情况来使用。

# 设备列表

![Alt text](/assets/zh-cn/WechatDev/wechat_13.png)

上面的操作中，我们已经获取到了设备列表。一般来说，客户可能拥有多个设备，因此，我们在这一步，就可以罗列一个设备列表，由用户自己决定，来操作哪台设备。

# 连接设备
想要操作具体哪台设备，我们就去连接哪台设备：gizwits.connect(did)。当然连接成功后，也有一个回调函数：gizwits.onConnected。此回调函数没有传入值。

注意，连接设备之前，必须先初始化。

初始化和连接设备，并非同步操作，因此，如果只是简单的先后执行，可能会出错。因此，建议可以将连接设备的操作，放在初始化的回调函数中，保证执行的先后关系。

连接成功后，我们就可以收到设备上报的数据了。上报的数据通过回调函数：gizwits.onReceivedAttrs。该回调函数会有一个回调值（参数），这个回调值的格式如下：

![Alt text](/assets/zh-cn/WechatDev/wechat_14.png)

上面的操作中，我们已经获取到了设备列表。一般来说，客户可能拥有多个设备，因此，我们在这一步，就可以罗列一个设备列表，由用户自己决定，来操作哪台设备。

连接设备

想要操作具体哪台设备，我们就去连接哪台设备：gizwits.connect(did)。当然连接成功后，也有一个回调函数：gizwits.onConnected。此回调函数没有传入值。

注意，连接设备之前，必须先初始化。

 初始化和连接设备，并非同步操作，因此，如果只是简单的先后执行，可能会出错。因此，建议可以将连接设备的操作，放在初始化的回调函数中，保证执行的先后关系。

连接成功后，我们就可以收到设备上报的数据了。上报的数据通过回调函数：gizwits.onReceivedAttrs。该回调函数会有一个回调值（参数），这个回调值的格式如下：

![Alt text](/assets/zh-cn/WechatDev/wechat_15.png)

# 手动读取：设备数据点

获取设备的数据点，也很简单，只需调用gizwits.read()方法，需要传入did。调用此方法，可以马上获取一次，同样，数据也是通过回调函数 gizwits.onReceivedAttrs，或者gizwits.onReceivedRaw来获取。

# 连接错误

当websocket连接错误时，会调用gizwits.onError函数，如有需要，可以重写该函数；回调值是错误信息：

```java
gizwits.onError = function(value){
    console.log("error!!!!:::::", value.toString());
}
```

# 设备上下线

当设备发生上线，或者下线的事件时，gizwits服务，会调用gizwits.onOnlineStatusChanged 回调函数.

回调值有两个参数：did和在线状态(is_online)。

```java
gizwits.onOnlineStatusChanged = function(value) {
    alert("设备上下线通知，did=", value.did);
    alert("设备上下线通知，is_online=", value.is_online);
}
```
# 控制设备

最后是，设备的远程控制。

  远程控制的调用方法，如果commType=custom，则使用gizwitsws.send(command)方法，如果commType=attrs_v4，则使用gizwitsws.write(command)方法。

远程控制的值，如果commType=custom，请输入p0，例如[<byte>,<byte>,<byte>...]；如果commType=attrs_v4，请输入datapoints，例如{"power":true}。

下面是远程控制RBG灯的代码样例：

```java
var command = '{"LED_R": 0, "LED_G": 0, "LED_B": 0}';
gizwits.write(did, JSON.parse(command));
```
 当然，使用控制设备的前提是，我们已经连接上了一台设备。

# 结语

至此，我们已经实现了微信接入的核心部分。在此教程中，Java-SDK与js-SDK为我们带来了很大的，我们几乎不用关心如何调用机智云的API和websocket，而是直接调用SDK的方法就可以了。

最后，希望大家能多多反馈意见，为更加便捷的开发贡献一份力量。


