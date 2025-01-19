package com.fintrack.fintrack.controller;

import com.fintrack.fintrack.external.api.ScreenerService;
import com.fintrack.fintrack.repository.RoleRepository;
import com.fintrack.fintrack.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/finTrack")
public class FinTrackController {

    @Autowired
    private RecordService recordService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ScreenerService screenerService;

    @GetMapping("/access")
    public String getTem(){return "ACCESS GRANTED!....";};

//    @GetMapping("/user-details")
//    public Map<String,Object>  getUserDetails(@AuthenticationPrincipal OAuth2User principle){
//        return principle.getAttributes();
//    }
}
