package com.cursorraffle.backend.controller;

import com.cursorraffle.backend.service.TimeService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/time")
public class TimeController {

    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    /**
     * Returns a continuous stream of server time events (SSE).
     * This is perfect for syncing client countdowns with server time.
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Map<String, String>> streamServerTime() {
        return timeService.getServerTimeStream()
                .map(instant -> Map.of(
                        "iso", instant.toString(),
                        "epoch", String.valueOf(instant.toEpochMilli())
                ));
    }
}

