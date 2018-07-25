

用JS||JQ简单实现了自动回复功能，这里使用了[图灵机器人](http://www.tuling123.com)的接口

效果图如下：

![](http://pb4oumact.bkt.clouddn.com/20180725173443.png)

<!--more-->

当然也可以用其他API，比如阿里云API接口，聚合数据等等，个人感觉图灵比较专业，功能可定义

![](http://pb4oumact.bkt.clouddn.com/20180725221410.png)

## 图灵机器人简介

> 图灵机器人API是在人工智能的核心能力（包括语义理解、智能问答、场景交互、知识管理等）的基础上，为广大开发者、合作伙伴和企业提供的一系列基于云计算和大数据平台的在线服务和开发接口。
开发者可以利用图灵机器人的API创建各种在线服务，灵活定义机器人的属性、编辑机器人的智能问答内容，打造个人专属智能交互机器人，也支持多渠道（微信公众平台、QQ聊天）的快速接入。

图灵机器人开发文档：[https://www.kancloud.cn/turing/web_api/522992](https://www.kancloud.cn/turing/web_api/522992)

## 使用流程

###获取APIKEY（获取对接口访问的权限）

注册->登录->创建机器人->管理机器人->复制APIKEY

###编码方式

UTF-8（调用图灵API的各个环节的编码方式均为UTF-8）

### 请求方式

API接口：<http://openapi.tuling123.com/openapi/api/v2>

编码方式：**UTF-8**

请求方式：**HTTP** **POST**

请求格式：**json**

请求参数：

| 参数 | 是否必须 | 长度 |           说明            |     举例     |
| :--: | :------: | :--: | :-----------------------: | :----------: |
| key  |   必须   |  32  |          APIkey           | 123456789788 |
| info |   必须   | 1-30 | 请求内容，编码方式为UTF-8 |    "1+2"     |

####  请求示例

[http://www.tuling123.com/openapi/api?key=APIKEY&info=你好](http://www.tuling123.com/openapi/api?key=KEY&info=你好)

####输出示例

```
{
	code: 100000,
	text: "感觉不错。你好吗？"
}
```

## 界面搭建

界面分成两大块

- 聊天部分
  - 左对话框
    - 机器人头像
    - 消息框
      - 三角形+长方形
  - 右对话框
    - 用户头像
    - 消息框
      - 三角形+长方形
- 发送内容
  - input内容框
  - button发送按钮

```html
<div id="cat_sever">
        <!--机器人客服-->
        <div class="robot">
            <div class="avatar">
                <img src="./images/robot_avatar.jpg">
            </div>
            <div class="cat">
                <span id="robot_contents">你好!有什么可以帮你的吗？^_^</span>
            </div>
        </div>
        <!--用户-->
        <div class="user" style="display: none;">
            <div class="avatar">
                <img src="./images/avatar.jpg">
            </div>
            <div class="cat">
                <span id="user_contents">你好!^_^</span>
            </div>
        </div>
</div>
<div class="send_chat">
    <input onkeypress="if(event.keyCode==13){document.getElementById('send').click()}" type="text" id="contents" required pattern=".{1,}" oninvalid="setCustomValidity('两至五个汉字')" oninput="setCustomValidity('')">
    <button type="submit" id="send">发送</button>
</div>
```

接下来要做的就是

-  获取内容 
  -  转成urlencode（因为直接获取的是中文字符串）
-  对话显示内容
  -  动态插入内容
-  清空输入框
   -  回车自动清空
   -  发送请求


- 请求接口
  - 返回消息
    -  输出消息


发送请求使用的是**AJAX**请求

这里写了两种方式获取，一个用JavaScript一个Jquery，可以比较下双方差别


```javascript
	//JavaScript
	var request = new XMLHttpRequest();
	var robot_contents = document.getElementById("robot_contents");
	var user_contents = document.getElementById("user_contents");
	var cat_server = document.getElementById("cat_sever");
	var send_button = document.getElementById('send');
	send_button.onclick = function() {
	    var contents = document.getElementById("contents").value;
	    if (contents.length != 0) {
	        var user_body = document.createElement("div");
	        user_body.innerHTML = ' <div class="user"><div class="avatar">' +
	            '<img src="images/avatar.jpg"></div><div class="cat">' +
	            '<span id="user_contents">' + contents + '</span></div></div>';
	        cat_server.appendChild(user_body);
	        contents = encodeURI(contents);
	        send(contents);
	        // 清空发送框
	        document.getElementById("contents").value = " ";
	    } else {
	        robot_contents.innerText = "哈？？你说啥我没听清？？";
	    }
	}

	function send(problem) {
	    var url = 'http://www.tuling123.com/openapi/api';
	    if (request) {
	        request.open("POST", url, true); //使用POST异步传输
	        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	        var data = "key=这里填写自己的APIKEY&userid=SmallMacro&info=" + problem;
	        request.send(data);
	        request.onreadystatechange = function() { //监听连接状态
	            if (request.readyState == 4 && request.status == 200) {
	                var robotContent = JSON.parse(request.responseText); //
	                var robot_body = document.createElement("div");
	                robot_body.innerHTML = ' <div class="robot"><div class="avatar">' +
	                    '<img src="images/robot_avatar.jpg"></div><div class="cat">' +
	                    '<span id="robot_contents">' + robotContent.text + '</span></div></div>';
	                cat_server.appendChild(robot_body);
	                console.log(robotContent.text);
	            } else {
	                console.log(request.status);
	            }
	        }
	    } else {
	        console.log('不能创建XMLHttpRequest对象');
	    }
	}
```

很明显，用原生JS跨域很麻烦

js使用的是**cors**方式

jq使用**Jsonp**方式

```javascript
//	用Jquery
$(document).ready(function() {
    $("#send").click(function() {
        if ($("#contents").val().length != 0) {
            $("<div>").addClass("user").html('<div class="avatar"><img src="images/avatar.jpg" ></div><div class="cat"><span id="user_contents">' + $("#contents").val() + '</span><div class="right_triangle"></div></div>').appendTo("#cat_sever");
            $.ajax({
                type: "POST",
                url: "http://www.tuling123.com/openapi/api",
                dataType: "json",
                data: {
                    "key": "这里填写自己的APIKEY",
                    "info": $("#contents").val(),
                    "userid": "SmallMacro",
                },
                success: function(data) {
                    $("#contents").val('');
                    $("<div>").addClass("robot").html('<div class="avatar"><img src="images/robot_avatar.jpg" ></div><div class="cat"><span id="robot_contents">' + data.text + '</span><div class="left_triangle"></div></div>').appendTo("#cat_sever");
                },
                error: function(jqXHR) {
                    $(".chat").html(" " + jqXHR.status);
                }
            })
        } else {
            alert("请认真问问题好嘛：）");
        }
    })
})
```



 这些代码都没优化就简单凑合着明白如何使用ajax发送接收请求就行

## 其他接口：

阿里云天池API：[https://market.aliyun.com](https://market.aliyun.com/products/57124001/cmapi013943.html?spm=5176.2020520132.101.6.SNdfCd#sku=yuncode794300000)

青云客智能聊天机器人API：[http://api.qingyunke.com/](http://api.qingyunke.com/)

聚合数据API：[https://www.juhe.cn](https://www.juhe.cn/docs/index/cid/1)



github地址奉上：[https://github.com/Small-Macro/RobotAutoReply](https://github.com/Small-Macro/RobotAutoReply)



