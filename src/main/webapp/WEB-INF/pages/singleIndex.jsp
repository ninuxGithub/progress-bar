<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Single Index</title>
<link href="https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
 <title>down2-单文件演示</title>
    <link href="js/down.css" type="text/css" rel="Stylesheet"/>
    <script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
    <script type="text/javascript" src="js/down-single.js" charset="utf-8"></script>
    <script language="javascript" type="text/javascript">
        var downMgr = new DownloaderMgr();
        //下载事件回调
        downMgr.event.downComplete = function (obj) { 
        	$(document.body).append("<div>文件下载完毕，文件路径：" + obj.fileSvr.pathLoc+"</div>"); 
        };
        downMgr.event.downError = function (obj, err) { };

    	$(function()
    	{
    	    downMgr.loadAuto();

    	    $("#btnSetPath").click(function ()
    	    {
    	        downMgr.open_folder();
    	    });

    	    $("#btnDownUrl").click(function ()
    	    {
    	        downMgr.down_file("downPanel", "http://localhost/downloadFile?fileName=apache-maven-3.5.0-bin.zip"/*, "自定义文件名称.exe"*/); //
//     	        downMgr.down_file("downPanel", "http://localhost/downloadFile?fileName=22161407.jpg"/*, "自定义文件名称.exe"*/); //
    		});

    	});
    </script>
</head>
<body style="width: 80%; height: 80%; margin: 0px auto;">
	<div class="row bootstrap-admin-no-edges-padding">
		<div class="col-md-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<p>此页面演示单个文件下载样式</p>
<!-- 				    <p><a href="db/clear.jsp" target="_blank">清空数据库</a></p> -->
<!-- 				    <p><a href="index.htm" target="_blank">多文件下载</a></p> -->
				    <div id="downPanel"></div>
<!-- 				    <input id="btnSetPath" type="button" value="设置下载路径" /> -->
					<input id="btnDownUrl" type="button" value="下载测试文件（点击下载）" />
				</div>
			</div>
		</div>
	</div>
</body>
</html>
