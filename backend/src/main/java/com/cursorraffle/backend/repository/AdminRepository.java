package com.cursorraffle.backend.repository;

import com.cursorraffle.backend.model.Admin;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface AdminRepository extends R2dbcRepository<Admin, Long> {
    Mono<Admin> findByEmail(String email);
}

