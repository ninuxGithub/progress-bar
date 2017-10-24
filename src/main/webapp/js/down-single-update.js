/*
 * @author linuxGithub update the original JS script
 * 
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



function DownloaderMgr()
{
	var _this = this;
	this.Config = {
		  "Folder"		: "C:\\Users\\shenzm\\Desktop\\down\\"
		, "Debug"		: false//调试模式
		, "LogFile"		: "C:\\Users\\shenzm\\Desktop\\down\\log.txt"//日志文件路径。
		, "Company"		: "LinuxGithub"
		, "Version"		: "1.1.0"
		, "License"		: ""//
		, "Cookie"		: ""//
		, "ThreadCount"	: 1//并发数
		, "FilePart"	: 1048576//文件块大小，更新进度时使用，计算器：http://www.beesky.com/newsite/bit_byte.htm
        //x86
		, "ClsidDown"	: "E94D2BA0-37F4-4978-B9B9-A4F548300E48"
		, "ClsidPart"	: "6528602B-7DF7-445A-8BA0-F6F996472569"
		, "CabPath"		: "http://www.ncmem.com/download/down2/down2.cab"
		//x64
		, "ClsidDown64"	: "0DADC2F7-225A-4cdb-80E2-03E9E7981AF8"
		, "ClsidPart64"	: "19799DD1-7357-49de-AE5D-E7A010A3172C"
		, "CabPath64"	: "http://www.ncmem.com/download/down2/down64.cab"
		//Firefox
		, "XpiType"		: "application/npHttpDown"
		, "XpiPath"	    : "http://www.ncmem.com/download/down2/down2.xpi"
		//Chrome
		, "CrxName"		: "npHttpDown"
		, "CrxType"		: "application/npHttpDown"
		, "CrxPath"	    : "http://www.ncmem.com/download/down2/down2.crx"
	    //Chrome 45
        , "NatHostName" : "com.xproer.down2"//
	    , "NatPath"		: "http://www.ncmem.com/download/down2/down2.nat.crx"
	    , "ExePath"		: "http://www.ncmem.com/download/down2/down2.exe"
	};
	
	//附加参数
	this.Fields = {
		 "uname": "test"
		,"upass": "test"
		,"uid":0
		,"fid":0
	};

	this.event = {
	      "downProcess": function (obj, speed, downLen, percent, time) { }
        , "downComplete": function (obj) { }
        , "downError": function (obj,err) { }
	};
	
	var browserName = navigator.userAgent.toLowerCase();
	this.ie = browserName.indexOf("msie") > 0;
	this.ie = this.ie ? this.ie : browserName.search(/(msie\s|trident.*rv:)([\w.]+)/) != -1;
	this.firefox = browserName.indexOf("firefox") > 0;
	this.chrome = browserName.indexOf("chrome") > 0;
	this.chrome45 = false;
	this.nat_load = false;
	this.chrVer = navigator.appVersion.match(/Chrome\/(\d+)/);


	this.idCount = 1; 	//上传项总数，只累加
	this.queueCount = 0;//队列总数
	this.filesMap = new Object(); //本地文件列表映射表
	this.fileCur = null;
	this.parter = null;
	this.btnSetup = null;//安装控件的按钮
	this.working = false;

	this.getHtml = function ()
	{
	    //自动安装CAB
	    var html = "";
	    //var acx = '<div style="display:none">';
	    /*
			IE静态加载代码：
			<object id="objDownloader" classid="clsid:E94D2BA0-37F4-4978-B9B9-A4F548300E48" codebase="http://www.qq.com/HttpDownloader.cab#version=1,2,22,65068" width="1" height="1" ></object>
			<object id="objPartition" classid="clsid:6528602B-7DF7-445A-8BA0-F6F996472569" codebase="http://www.qq.com/HttpDownloader.cab#version=1,2,22,65068" width="1" height="1" ></object>
		*/
	    if (this.ie)
	    {
	        html += '<object name="parter" classid="clsid:' + this.Config["ClsidPart"] + '"';
	        html += ' codebase="' + this.Config["CabPath"] + '#version=' + _this.Config["Version"] + '" width="1" height="1" ></object>';
	    }
	    else if (this.firefox)
	    {
	        html += '<embed name="parter" type="' + this.Config.XpiType + '" pluginspage="' + this.Config.XpiPath + '" width="1" height="1"/>';
	    }
	    else if (this.chrome)
	    {
	        html += '<embed name="parter" type="' + this.Config.CrxType + '" pluginspage="' + this.Config.CrxPath + '" width="1" height="1"/>';
	    }
	    //acx += '</div>';
	    //上传列表项模板
	    html += '<div class="file-item file-item-single" name="fileItem">\
                    <div class="img-box"><img src="js/file.png"/></div>\
					<div class="area-l">\
						<div name="fileName" class="name">HttpUploader程序开发.pdf</div>\
						<div name="percent" class="percent">(35%)</div>\
						<div name="fileSize" class="size" child="1">1000.23MB</div>\
						<div class="process-border"><div name="process" class="process"></div></div>\
						<div name="msg" class="msg top-space">15.3MB 20KB/S 10:02:00</div>\
					</div>\
					<div class="area-r">\
                        <a class="btn-box" name="cancel" title="取消">取消</a>\
                        <a class="btn-box hide" name="down" title="继续"><div>继续</div></a>\
						<a class="btn-box hide" name="stop" title="停止"><div>停止</div></a>\
						<a class="btn-box hide" name="del" title="删除"><div>删除</div></a>\
					</div>\
				</div>';    
	    
	    return html;
	};

	this.set_config = function (v) { jQuery.extend(this.Config, v); };
	this.down_file = function (id,url,f_name)
	{
	    var _this = this;
	    var panel = $("#" + id);
	    var fileNameArray = url.split("/");
	    var fileName = fileNameArray[fileNameArray.length - 1];	    
	    var fid = this.idCount++;
	    var fileLoc = { fileUrl: url, id: fid };
	    if (typeof (f_name) == "string")
	    {
	        jQuery.extend(fileLoc, { nameCustom: f_name });
	        fileName = f_name;
	    }

	    var ui = this.tmpFile.clone();
	    ui.css("display", "block");
	    panel.append(ui);

	    var uiName = ui.find("div[name='fileName']")
	    var uiSize = ui.find("div[name='fileSize']");
	    var uiProcess = ui.find("div[name='process']");
	    var uiPercent = ui.find("div[name='percent']");
	    var uiMsg = ui.find("div[name='msg']");
	    var btnCancel = ui.find("a[name='cancel']");
	    var btnStop = ui.find("a[name='stop']");
	    var btnDown = ui.find("a[name='down']");
	    var btnDel = ui.find("a[name='del']");
	    var ui_eles = { msg: uiMsg, name: uiName, size: uiSize, process: uiProcess, percent: uiPercent, btn: { cancel: btnCancel, stop: btnStop, down: btnDown, del: btnDel }, div: ui};

	    var downer = new Downloader(fileLoc, this);
	    this.filesMap[fid] = downer;//
	    jQuery.extend(downer.ui, ui_eles);

	    uiName.text(fileName);
	    uiName.attr("title", url);
	    uiMsg.text("");
	    uiPercent.text("(0%)");
	    btnDel.click(function () { downer.delete(); });
	    btnStop.click(function () { downer.stop(); });
	    btnDown.click(function () { downer.down(); });
	    btnCancel.click(function () { downer.delete(); });

	    downer.addQueue();//添加到队列
	    downer.ready(); //准备
	    this.fileCur = downer;
	    this.start_queue();//下载队列
	    return downer;
	};
	this.open_folder = function (json)
	{
	    this.browser.openFolder();
	};
	this.down_process = function (json)
	{
	    var p = this.filesMap[json.id];
	    p.down_process(json);
	};
	this.down_error = function (json)
	{
	    var p = this.filesMap[json.id];
	    p.down_error(json);
	};
	this.down_recv_size = function (json)
	{
	    var p = this.filesMap[json.id];
	    p.down_recv_size(json);
	};
	this.down_recv_name = function (json)
	{
	    var p = this.filesMap[json.id];
	    p.down_recv_name(json);
	};
	this.down_complete = function (json)
	{
	    var p = this.filesMap[json.id];
	    p.down_complete(json);
	};
	this.start_queue = function () { this.browser.startQueue(); };
	this.stop_queue = function (json)
	{
	    this.browser.stopQueue();
	};
	this.queue_begin = function (json) { this.working = true; };
	this.queue_end = function (json) { this.working = false; };
	this.load_complete = function (json) { this.nat_load = true; if (this.btnSetup) this.btnSetup.hide(); };
	this.recvMessage = function (str)
	{
	    var json = JSON.parse(str);
	    if (json.name == "open_files") { _this.open_files(json); }
	    else if (json.name == "open_folder") { _this.open_folders(json); }
	    else if (json.name == "down_recv_size") { _this.down_recv_size(json); }
	    else if (json.name == "down_recv_name") { _this.down_recv_name(json); }
	    else if (json.name == "down_process") { _this.down_process(json); }
	    else if (json.name == "down_error") { _this.down_error(json); }
	    else if (json.name == "down_complete") { _this.down_complete(json); }
	    else if (json.name == "queue_begin") { _this.queue_begin(json); }
	    else if (json.name == "queue_end") { _this.queue_end(json); }
	    else if (json.name == "load_complete") { _this.load_complete(); }
	};

    //浏览器对象
	this.browser = {
	      entID: "Downloader2Event"
	    , cbkID: "Downloader2EventCallBack"
		, check: function ()//检查插件是否已安装
		{
		    return null != this.GetVersion();
		}
        , checkFF: function ()
        {
            var mimetype = navigator.mimeTypes;
            if (typeof mimetype == "object" && mimetype.length)
            {
                for (var i = 0; i < mimetype.length; i++)
                {
                    var enabled = mimetype[i].type == _this.Config.XpiType;
                    if (!enabled) enabled = mimetype[i].type == _this.Config.XpiType.toLowerCase();
                    if (enabled) return mimetype[i].enabledPlugin;
                }
            }
            else
            {
                mimetype = [_this.Config.XpiType];
            }
            if (mimetype)
            {
                return mimetype.enabledPlugin;
            }
            return false;
        }
        , checkChr: function () { }
        , checkNat: function () { }
        , NeedUpdate: function ()
        {
            return this.GetVersion() != _this.Config.Version;
        }
		, GetVersion: function ()
		{
		    var v = null;
		    try
		    {
		        v = _this.parter.Version;
		        if (v == undefined) v = null;
		    }
		    catch (e) { }
		    return v;
		}
		, Setup: function ()
		{
		    //文件夹选择控件
		    acx += '<object classid="clsid:' + _this.Config.ClsidPart + '"';
		    acx += ' codebase="' + _this.Config.CabPath + '" width="1" height="1" ></object>';

		    $("body").append(acx);
		}
        , init: function ()
        {
            this.initNat();//
            var param = { name: "init", config: _this.Config };
            this.postMessage(param);
        }
        , initNat: function ()
        {
            if (!_this.chrome45) return;
            this.exitEvent();
            document.addEventListener(this.cbkID, function (evt)
            {
                _this.recvMessage(JSON.stringify(evt.detail));
            });
        }
        , exit: function ()
        {
            var par = { name: 'exit' };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(this.entID, true, false, par);
            document.dispatchEvent(evt);
        }
        , exitEvent: function ()
        {
            var obj = this;
            $(window).bind("beforeunload", function () { obj.exit(); });
        }
        , openFolder: function ()
        {
            var param = { name: "open_folder", config: _this.Config };
            this.postMessage(param);
        }
		, openPath: function (f)
		{
		    var param = { name: "open_path", config: _this.Config };
		    this.postMessage(param);
		}
		, openFile: function (f)
		{
		    var param = { name: "open_file", config: _this.Config };
		    this.postMessage(param);
		}
        , addFile: function (f)
        {
            var param = { name: "add_file", config: _this.Config };
            jQuery.extend(param, f);
            this.postMessage(param);
        }
        , stopFile: function (f)
        {
            var param = { name: "stop_file", id: f.id, config: _this.Config };
            this.postMessage(param);
        }
        , startQueue: function ()
        {
            var param = { name: "start_queue", config: _this.Config };
            this.postMessage(param);
        }
        , stopQueue: function ()
        {
            var param = { name: "stop_queue", config: _this.Config };
            this.postMessage(param);
        }
        , postMessage: function (json)
        {
            if(this.check()) _this.parter.postMessage(JSON.stringify(json));
        }
        , postMessageNat: function (par)
        {
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(this.entID, true, false, par);
            document.dispatchEvent(evt);
        }
	};

	this.checkVersion = function ()
	{
	    //Win64
	    if (window.navigator.platform == "Win64")
	    {
	        _this.Config["CabPath"] = _this.Config["CabPath64"];

	        _this.Config["ClsidDown"] = _this.Config["ClsidDown64"];
	        _this.Config["ClsidPart"] = _this.Config["ClsidPart64"];

	        _this.ActiveX["Down"] = _this.ActiveX["Down64"];
	        _this.ActiveX["Part"] = _this.ActiveX["Part64"];
	    }
	    else if (this.firefox)
	    {
	        this.browser.check = this.browser.checkFF;
	    }
	    else if (this.chrome)
	    {
	        this.browser.check = this.browser.checkFF;
	        jQuery.extend(this.Config.firefox, this.Config.chrome);
	        //44+版本使用Native Message
	        if (parseInt(this.chrVer[1]) >= 44)
	        {
	            _this.firefox = true;
	            if (!this.browser.checkFF())//仍然支持npapi
	            {
	                this.browser.postMessage = this.browser.postMessageNat;
	                _this.firefox = false;
	                _this.chrome = false;
	                _this.chrome45 = true;//
	            }
	        }
	    }
	};
	this.checkVersion();
	this.setup_tip = function ()
	{
	    $(document.body).append('<a id="btnSetup" href="' + _this.Config.ExePath + '" target="_blank">请先安装控件</a>');
	    this.btnSetup = $("#btnSetup");
	};
	this.setup_check = function ()
	{
	    if (!_this.browser.check()) { this.setup_tip(); /*_this.browser.Setup();*/ }
	};

    //安全检查，在用户关闭网页时自动停止所有上传任务。
	this.safeCheck = function ()
	{
	    $(window).bind("beforeunload", function (event)
	    {
	        if (_this.working)
	        {
	            event.returnValue = "您还有程序正在运行，确定关闭？";
	        }
	    });

	    $(window).bind("unload", function ()
	    {
	        if (_this.working)
	        {
	            _this.stop_queue();
	        }
	    });
	};

	this.loadAuto = function ()
	{
	    var html = this.getHtml();
	    var ui = $(document.body).append(html);
	    this.initUI(ui);
	};
    //加截到指定dom
	this.loadTo = function (id)
	{
	    var obj = $("#" + id);
	    var html = this.getHtml();
	    var ui = obj.append(html);
	    this.initUI(ui);
	};
	this.initUI = function (ui/*jquery obj*/)
	{
	    this.tmpFile = ui.find('div[name="fileItem"]');
	    this.parter = ui.find('embed[name="parter"]').get(0);
	    if (this.ie) this.parter = ui.find('object[name="parter"]').get(0);
	    if(!this.chrome45) this.parter.recvMessage = this.recvMessage;

	    var btnSetFolder = ui.find('input[name="btnSetFolder"]');
	    this.spliter = ui.find('div[name="spliter"]');

	    _this.browser.init(); //
	    //设置下载文件夹
	    btnSetFolder.click(function () { _this.open_folder(); });

	    this.safeCheck();//
	    this.setup_check();
	};
}

//错误类型
var DownloadErrorCode = {
    "0": "发送数据错误"
	, "1": "接收数据错误"
	, "2": "访问本地文件错误"
	, "3": "域名未授权"
	, "4": "文件大小超过限制"
	, "5": "地址为空"
};
//状态
var HttpDownloaderState = {
    Ready: 0,
    Posting: 1,
    Stop: 2,
    Error: 3,
    GetNewID: 4,
    Complete: 5,
    WaitContinueUpload: 6,
    None: 7,
    Waiting: 8
};
//文件下载对象
function Downloader(fileLoc, mgr)
{
    var _this = this;
    this.ui = { msg: null, process: null, percent: null, btn: { del: null, cancel: null, post: null, stop: null }, div: null, split: null };
    this.browser = mgr.browser;
    this.Manager = mgr;
    this.Config = mgr.Config;
    this.fields = jQuery.extend({}, mgr.Fields);//每一个对象自带一个fields幅本
    this.State = HttpDownloaderState.None;
    this.event = mgr.event;
    this.fileSvr = {
        id: 0//累加，唯一标识
        , idSvr: 0
        , uid: 0
        , nameLoc: ""
        , folderLoc: this.Config["Folder"]
        , pathLoc: ""
        , fileUrl: ""
        , lenLoc: 0
        , lenSvr: 0
        , sizeSvr: "0byte"
        , complete: false
    };
    jQuery.extend(this.fileSvr, fileLoc);//覆盖配置

    this.hideBtns = function ()
    {
        $.each(this.ui.btn, function (i, n)
        {
            $(n).hide();
        });
    };

    //方法-准备
    this.ready = function ()
    {
        this.hideBtns();
        this.ui.btn.cancel.show();
        //this.pButton.style.display = "none";
        this.ui.msg.text("正在下载队列中等待...");
        this.State = HttpDownloaderState.Ready;
    };

    this.addQueue = function ()
    {
        this.browser.addFile(this.fileSvr);
    };

    //方法-开始下载
    this.down = function ()
    {
        this.hideBtns();
        this.ui.btn.stop.show();
        this.ui.msg.text("开始连接服务器...");
        this.State = HttpDownloaderState.Posting;
        this.browser.addFile(this.fileSvr);
        this.Manager.start_queue();//下载队列
    };

    //方法-停止传输
    this.stop = function ()
    {
        this.hideBtns();
        this.ui.btn.down.show();
        //this.SvrUpdate();
        this.State = HttpDownloaderState.Stop;
        this.ui.msg.text("下载已停止");
        this.browser.stopFile(this.fileSvr);
    };

    this.delete = function ()
    {
        this.browser.stopFile(this.fileSvr);
        //从上传列表中删除
        this.ui.split.remove();
        this.ui.div.remove();
        this.svr_delete();
    };

    this.open = function ()
    {
        this.browser.openFile(this.fileSvr);
    };

    this.openPath = function ()
    {
        this.browser.openPath(this.fileSvr);
    };

    this.isComplete = function () { return this.State == HttpDownloaderState.Complete; };

    this.down_complete = function ()
    {
        this.hideBtns();
        this.event.downComplete(this);//biz event
        //this.ui.btn.del.text("打开");
        this.ui.process.css("width", "100%");
        this.ui.percent.text("(100%)");
        this.ui.msg.text("下载完成");
        this.State = HttpDownloaderState.Complete;
        //注释了删除
        //this.svr_delete();
    };

    this.down_recv_size = function (json)
    {
        this.ui.size.text(json.size);
        this.fileSvr.sizeSvr = json.size;
        this.fileSvr.lenSvr = json.len;
    };

    this.down_recv_name = function (json)
    {
        this.hideBtns();
        this.ui.btn.stop.show();
        this.ui.name.text(json.nameSvr);
        this.ui.name.attr("title", json.nameSvr);
        this.fileSvr.pathLoc = json.pathLoc;
        if (this.fileSvr.nameLoc.length < 1) this.fileSvr.nameLoc = json.nameSvr;
    };

    this.down_process = function (json)
    {
        this.fileSvr.lenLoc = json.lenLoc;//保存进度
        this.fileSvr.perLoc = json.percent;
        this.ui.percent.text("(" + json.percent + ")");
        this.ui.process.css("width", json.percent);
        var msg = [json.sizeLoc, " ", json.speed, " ", json.time];
        this.ui.msg.text(msg.join(""));
    };

    //更新服务器进度
    this.down_part = function (json)
    {
        this.svr_update();
    };

    this.down_begin = function (json)
    {
        var lenSvr = this.fileSvr.lenSvr;
        var filePart = this.Config["FilePart"];
        if (lenSvr > filePart && 0 == this.fileSvr.idSvr)
        {
            this.svr_create();
        }
    };

    this.down_error = function (json)
    {
        this.hideBtns();
        this.ui.btn.down.show();
        this.ui.btn.del.show();
        this.event.downError(this, json.code);//biz event
        this.ui.msg.text(DownloadErrorCode[json.code + ""]);
        this.State = HttpDownloaderState.Error;
        //this.SvrUpdate();
    };
}