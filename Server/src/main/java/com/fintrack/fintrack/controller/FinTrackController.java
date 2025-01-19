package com.fintrack.fintrack.controller;

import com.fintrack.fintrack.entity.Records;
import com.fintrack.fintrack.entity.Roles;
import com.fintrack.fintrack.external.api.ScreenerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/finTrack")
public class FinTrackController {

    @Autowired
    private ScreenerService screenerService;

    @GetMapping("/access")
    public String getTem(){return "ACCESS GRANTED!....";};

    @GetMapping("/user-details")
    public Map<String,Object>  getUserDetails(@AuthenticationPrincipal OAuth2User principle){
        return principle.getAttributes();
    }
}
