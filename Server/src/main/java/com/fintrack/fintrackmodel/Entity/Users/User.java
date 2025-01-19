package com.fintrack.fintrackmodel.Entity.Users;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity(name = "user_table")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String username;
    private String email;
    private String password;
    private String registrationSource;
//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(name = "users_role", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
//            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id") )
//    Set<Roles> roles = new HashSet<>();
    private String role;
}
