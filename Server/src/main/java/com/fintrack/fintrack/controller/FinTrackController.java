package com.fintrack.fintrack.controller;

import com.fintrack.fintrack.entity.Records;
import com.fintrack.fintrack.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/finTrack")
public class FinTrackController {

    @Autowired
    private RecordService recordService;

    @GetMapping
    public String getTem(){return "ACCESS GRANTED!....";};
    @GetMapping("/get-records")
    public List<Records> getRecords(){
        return recordService.getRecords();
    }
    @PostMapping("/post-records")
    public Records postRecords(@RequestBody String recordsName){
        return recordService.postRecords(recordsName);
    }

}
