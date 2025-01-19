package com.fintrack.fintrack.repository;

import com.fintrack.fintrackmodel.Entity.Stocks.StockDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockDetailsRepository extends JpaRepository<StockDetails, Long> {
}
