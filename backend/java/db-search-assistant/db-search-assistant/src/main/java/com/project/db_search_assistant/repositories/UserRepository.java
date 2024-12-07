package com.project.db_search_assistant.repositories;

import com.project.db_search_assistant.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
