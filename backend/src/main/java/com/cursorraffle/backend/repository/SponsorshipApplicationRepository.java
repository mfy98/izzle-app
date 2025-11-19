package com.cursorraffle.backend.repository;

import com.cursorraffle.backend.model.SponsorshipApplication;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface SponsorshipApplicationRepository extends R2dbcRepository<SponsorshipApplication, Long> {
    Flux<SponsorshipApplication> findByStatus(String status);
    Flux<SponsorshipApplication> findByAdvertiserId(Long advertiserId);
    Mono<SponsorshipApplication> findByTypeAndStatus(String type, String status);
}

