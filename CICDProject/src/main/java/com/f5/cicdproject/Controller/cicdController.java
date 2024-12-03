package com.f5.cicdproject.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cicd")
public class cicdController {
    @GetMapping("/")
    public String homePage(HttpServletRequest request){
        return "home";
    }
}
