package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.example.demo.utils.FileUploadUtil;

@Controller
public class UploadController {

	@RequestMapping("/progress")
	public void progress(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value = "file") CommonsMultipartFile file, @RequestParam("author") String author) {
		response.setContentType("text/html");
		response.setCharacterEncoding("GBK");
		PrintWriter out = null;
		System.out.println("作者为："+ author);
		boolean flag = false;
		if (file.getSize() > 0) {
			// 文件上传的位置可以自定义
			String originalFilename = file.getOriginalFilename();
			String contentType = file.getContentType();
			long size = file.getSize();
			flag = FileUploadUtil.uploadFile(request, file);
			System.out.println("上传文件的名称为：" + originalFilename);
			System.out.println("上传文件的类型为：" + contentType);
			System.out.println("上传文件的大小为：" + size);
		}
		try {
			out = response.getWriter();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (flag == true) {
			out.print("1");
		} else {
			out.print("2");
		}

	}
	@RequestMapping("/upload")
	public void upload(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("进入后台...");
		 // 1.创建DiskFileItemFactory对象，配置缓存用
        DiskFileItemFactory diskFileItemFactory = new DiskFileItemFactory();

        // 2. 创建 ServletFileUpload对象
        ServletFileUpload servletFileUpload = new ServletFileUpload(diskFileItemFactory);

        // 3. 设置文件名称编码
        servletFileUpload.setHeaderEncoding("utf-8");
        
        Map<String, String[]> parameterMap = request.getParameterMap();
        for (String name : parameterMap.keySet()) {
        	String[] arrs = parameterMap.get(name);
        	System.out.println("参数名称："+ name + " 值："+ Arrays.toString(arrs));
		}

        // 4. 开始解析文件
        try {
            List<FileItem> items = servletFileUpload.parseRequest(request);
            for (FileItem fileItem : items) {

                if (fileItem.isFormField()) { // >> 普通数据
                    String info = fileItem.getString("utf-8");
                    System.out.println("info:" + info);
                } else { // >> 文件
                    // 1. 获取文件名称
                    String name = fileItem.getName();
                    // 2. 获取文件的实际内容
                    InputStream is = fileItem.getInputStream();

                    // 3. 保存文件
                    FileUtils.copyInputStreamToFile(is, new File("C:\\Users\\shenzm\\Desktop\\upload" + "/" + name));
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

	}

	@RequestMapping(value = "/fileUpload", method = RequestMethod.GET)
	public String fileUploadPage() {
		System.out.println("fileUpload");
		return "fileUpload";
	}
	@RequestMapping(value = "/fileUpload-update", method = RequestMethod.GET)
	public String fileUploadPageUpdate() {
		return "fileUpload-update";
	}
	@RequestMapping(value = "/webuploader", method = RequestMethod.GET)
	public String webUploader() {
		return "webuploader";
	}

	@RequestMapping(value = { "/", "/index" }, method = RequestMethod.GET)
	public String index() {
		System.err.println("index");
		return "index";
	}

}
