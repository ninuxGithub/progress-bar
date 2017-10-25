<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Upload Show Model Dialog</title>
<link href="https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
<link href="css/upload-update.css" rel="stylesheet">

<script type="text/javascript">
	function UpladFile() {
		$('#myModal').show();
		$('#message').html("文件正在上传，请等待....");
		var fileObj = document.getElementById("file").files[0]; // js 获取文件对象
		if(fileObj == null || fileObj == 'undefined' || fileObj == undefined){
			$('#message').html("上传文件为空!");
			return;
		}
		var uploadUrl = "progress"; // 接收上传文件的后台地址 
		var form = new FormData();// FormData 对象---进行无刷新上传
		form.append("author", "linuxGithub"); // 可以增加表单数据
		form.append("file", fileObj); // 文件对象
		console.dir(fileObj)
		var xhr = new XMLHttpRequest();// XMLHttpRequest 对象
		xhr.open("post", uploadUrl, true);
        xhr.addEventListener('beforeSend', function () {// 上传前初始化,设置
        	console.dir('beforeSend')
        });
        xhr.addEventListener("load", function(evt){//请求完成后执行的操作
            console.dir(evt.srcElement.responseText)//消息来自evt.srcElement对象，设置返回值
            if(evt.srcElement.responseText == 1){
				$('#message').html("上传完成!")
            }else{
				$('#message').html("上传失败!")
            }
        }, false);
		xhr.upload.addEventListener("progress", function(evt){//监听progress事件
			var progressBar = document.getElementById("progressBar");
			var percentageDiv = document.getElementById("percentage");
			if (evt.lengthComputable) {
				progressBar.max = evt.total;
				progressBar.value = evt.loaded;
				percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
			}
		}, false);
        xhr.addEventListener("error", function(evt){//请求error
        	$('#message').html("上传失败!")
        }, false);
        xhr.addEventListener("abort", function(evt){//请求中断
        	$('#message').html("上传失败!")
        }, false);
		xhr.send(form);//发送请求
	}
</script>
</head>
<body style="width: 80%; height: 80%; margin: 0px auto;">
	<div class="row bootstrap-admin-no-edges-padding">
		<div class="col-md-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<div class="text-muted bootstrap-admin-box-title">文件管理</div>
				</div>
				<div class="bootstrap-admin-panel-content">
					<div class="file-box">
						<input type='text' name='textfield' id='textfield' class='txt' />
						<input type='button' class='btn' value='浏览...' /> 
						<input type="file" name="file" class="file" id="file" size="28" onchange="document.getElementById('textfield').value=this.value" />
						<input type="submit" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal" name="submit"  value="上传" onclick="UpladFile()" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 模态框（Modal） -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title" id="myModalLabel">文件上传进度</h4>
					</div>
					<div class="modal-body">
						<progress id="progressBar" value="0" max="100" style="width: 100%; height: 20px;"> </progress>
						<span id="percentage" style="color: blue;"></span> <br> <br>
						<span id="message"></span><br>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">关闭 </button>
					</div>
				</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>
	<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</body>
</html>