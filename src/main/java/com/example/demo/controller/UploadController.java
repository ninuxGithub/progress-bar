package com.example.demo.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

	@RequestMapping(value = "/fileUpload", method = RequestMethod.GET)
	public String fileUploadPage() {
		System.out.println("fileUpload");
		return "fileUpload";
	}
	@RequestMapping(value = "/fileUpload-update", method = RequestMethod.GET)
	public String fileUploadPageUpdate() {
		return "fileUpload-update";
	}

	@RequestMapping(value = { "/", "/index" }, method = RequestMethod.GET)
	public String index() {
		System.err.println("index");
		return "index";
	}

}
