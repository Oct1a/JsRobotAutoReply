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
	        var data = "key=ac2e79e2e54b42cc8c41cf4d4c05288a&userid=SmallMacro&info=" + problem;
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