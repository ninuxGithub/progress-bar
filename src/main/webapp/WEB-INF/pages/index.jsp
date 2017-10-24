<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Index</title>
<link href="https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">

<style type="text/css">
.file-box {
	position: relative;
	width: 340px
}

.txt {
	height: 22px;
	border: 1px solid #cdcdcd;
	width: 180px;
	vertical-align: middle;
	margin: 0;
	padding: 0
}

.btn {
	border: 1px solid #CDCDCD;
	height: 24px;
	width: 70px;
	vertical-align: middle;
	margin: 0;
	padding: 0
}

.file {
	position: absolute;
	top: 0;
	right: 80px;
	height: 24px;
	filter: alpha(opacity :   0);
	opacity: 0;
	width: 260px;
	vertical-align: middle;
	margin: 0;
	padding: 0
}
</style>
</head>
<body style="width: 80%; height: 80%; margin: 0px auto;">
	<div class="row bootstrap-admin-no-edges-padding">
		<div class="col-md-12">
			<div class="panel panel-default">
				<div class="panel-heading">
					<a href="${pageContext.request.contextPath}/downloadFile?fileName=22161407.jpg">图片下载</a><br>
					<a href="${pageContext.request.contextPath}/downloadFile?fileName=apache-maven-3.5.0-bin.zip">apache-maven-3.5.0-bin.zip下载</a><br/>
					<br>
					<br>
					<a href="${pageContext.request.contextPath}/singleIndex">singleIndex</a><br/>
					<br>
					<br>
					<a href="${pageContext.request.contextPath}/fileUpload">fileUpload</a><br/>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
