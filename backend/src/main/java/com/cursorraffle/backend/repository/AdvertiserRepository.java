package com.cursorraffle.backend.repository;

import com.cursorraffle.backend.model.Advertiser;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface AdvertiserRepository extends R2dbcRepository<Advertiser, Long> {
    Mono<Advertiser> findByContactEmail(String contactEmail);
}

