package com.fintrack.fintrack.controller;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/v1/finTrack")
public class FinTrackController {


    @GetMapping("/access")
    public String getTem(){return "ACCESS GRANTED!....";};

}
