package com.fintrack.fintrack.service;

import com.fintrack.fintrack.entity.Records;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RecordService {
    Records postRecords(String recordName);
    List<Records> getRecords();
}
