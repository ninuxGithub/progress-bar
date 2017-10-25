package com.example.demo.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class DownloadController {
	
	private static final Logger logger  = LoggerFactory.getLogger(DownloadController.class);
	
	
	private static final String riskReportLocation = "C:\\Users\\shenzm\\Desktop\\upload";

	@RequestMapping(value="/singleIndex", method = RequestMethod.GET)
	public String singleIndex() {
		return "singleIndex";
	}
	@RequestMapping(value="/downloadFile", method = RequestMethod.GET)
	public void download(HttpServletRequest request, HttpServletResponse response) {
		String fileName = request.getParameter("fileName");
		logger.info("fileName is :{}", fileName);
		
		if(StringUtils.isBlank(fileName) || StringUtils.isBlank(fileName)){
			logger.error("下载的文件名称为空或者文件名称为空");
			return;
		}
		
		String realPath = riskReportLocation+"\\"+fileName;
		
		File file = new File(realPath);
		if(!file.exists()){
			logger.error("下载的文件在磁盘上找不到");
			return;
		}
		
		try {
			InputStream in = new BufferedInputStream(new FileInputStream(file));
			System.out.println("文件大小："+ in.available());
			byte[] buffer = new byte[in.available()];
			in.read(buffer);
			in.close();
			response.reset();
			
			OutputStream out = new BufferedOutputStream(response.getOutputStream()); 
			response.setHeader("Content-Type", "application/force-download");
			response.setHeader("Content-Type", "application/vnd.ms-excel");
			response.addHeader("Content-Length", "" + file.length());
			response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes("UTF-8"),"ISO-8859-1"));
			out.write(buffer);
			out.flush();
			out.close();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
//		System.out.println("下载中...");
//		InputStream inputStream = null;
//		RandomAccessFile randomAccessFile = null;
//		try {
//			HttpURLConnection urlConnection = (HttpURLConnection) new URL(url).openConnection();
//			urlConnection.setRequestMethod("GET");
//			urlConnection.setConnectTimeout(10 * 1000);
//			File file = new File(path);
//			// 文件夹是否存在
//			if (!file.getParentFile().exists())
//				file.getParentFile().mkdir();
//			if (file.exists())
//				file.delete();
//			file.createNewFile();
//
//			int responseCode = urlConnection.getResponseCode();
//			if (responseCode >= 200 && responseCode < 300) {
//				inputStream = urlConnection.getInputStream();
//				int len = 0;
//				byte[] data = new byte[4096];
//				// 用于保存当前进度（具体进度）
//				int progres = 0;
//				// 获取文件长度
//				int maxProgres = urlConnection.getContentLength();
//				randomAccessFile = new RandomAccessFile(file, "rwd");
//				// 设置文件大小
//				randomAccessFile.setLength(maxProgres);
//				// 将文件大小分成100分，每一分的大小为unit
//				int unit = maxProgres / 100;
//				// 用于保存当前进度(1~100%)
//				int unitProgress = 0;
//				while (-1 != (len = inputStream.read(data))) {
//					randomAccessFile.write(data, 0, len);
//					progres += len;// 保存当前具体进度
//					int temp = progres / unit; // 计算当前百分比进度
//					if (temp >= 1 && temp > unitProgress) {// 如果下载过程出现百分比变化
//						unitProgress = temp;// 保存当前百分比
//						System.out.println("正在下载中..." + unitProgress + "%");
//					}
//				}
//				inputStream.close();
//				System.out.println("下载完成...");
//			} else {
//				System.out.println("服务器异常...");
//			}
//		} finally {
//			if (null != inputStream) {
//				inputStream.close();
//			}
//			if (null != randomAccessFile) {
//				randomAccessFile.close();
//			}
//		}
	}

}
