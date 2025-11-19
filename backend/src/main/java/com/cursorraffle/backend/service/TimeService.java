package com.cursorraffle.backend.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.Instant;

@Service
public class TimeService {

    /**
     * Emits the current server time every second.
     * Shared flux to avoid creating a new timer for every client.
     */
    public Flux<Instant> getServerTimeStream() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(tick -> Instant.now())
                .share(); // Broadcast to all subscribers
    }
}

