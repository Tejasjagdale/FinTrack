package com.fintrack.fintrackmodel.Entity.Users;

import jakarta.persistence.*;
import lombok.*;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity(name = "tem")
public class Records {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name")
    private String name;
}
