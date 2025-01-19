package com.fintrack.fintrackmodel.Entity.Stocks;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "stock_details")
@Table(name = "stock_details")
@IdClass(StockDetailsPrimaryKey.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class StockDetails {

    @Id
    private String nseScriptCode;

    @Id
    private String companyName;

    private String growwContractId;

    private String growwSearchId;

    private String bseScriptCode;

    @Column(unique = true, updatable = false)
    private String finTrackId;

    // Custom method to generate "ftXXXX"
    @PrePersist
    public void generateFinTrackId() {
        if (this.finTrackId == null) {
            long nextValue = System.currentTimeMillis() % 10000;  // Simple custom logic, replace with a sequence if needed
            this.finTrackId = "ft" + String.format("%04d", nextValue);
        }
    }
}
