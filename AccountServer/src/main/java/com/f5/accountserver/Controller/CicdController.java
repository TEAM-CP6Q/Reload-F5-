package com.f5.accountserver.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CicdController {
    @GetMapping("/home")
    public String homePage(HttpServletRequest request){
        return "home";
    }
}
