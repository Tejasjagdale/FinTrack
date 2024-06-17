package com.fintrack.fintrack.service.Impl;

import com.fintrack.fintrack.entity.Records;
import com.fintrack.fintrack.repository.RecordRepository;
import com.fintrack.fintrack.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordServiceImpl implements RecordService {

    @Autowired
    private RecordRepository recordRepository;
    @Override
    public Records postRecords(String recordName) {
        Records records = Records.builder().name(recordName).build();
        return recordRepository.save(records);
    }

    @Override
    public List<Records> getRecords() {
        return recordRepository.findAll();
    }
}
