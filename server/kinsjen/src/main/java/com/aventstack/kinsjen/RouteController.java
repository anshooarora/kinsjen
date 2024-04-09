package com.aventstack.kinsjen;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping(value = {"/", "/start", "/orgs", "/pipelines", "/jenkins"})
    public String index() {
        return "index.html";
    }

}
