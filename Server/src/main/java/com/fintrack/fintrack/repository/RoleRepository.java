package com.fintrack.fintrack.repository;
import com.fintrack.fintrackmodel.Entity.Users.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RoleRepository extends JpaRepository<Roles,Long> {
    Roles findByRole(String name);
}
