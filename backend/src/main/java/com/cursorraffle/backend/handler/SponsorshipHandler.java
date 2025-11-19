package com.cursorraffle.backend.handler;

import com.cursorraffle.backend.model.SponsorshipApplication;
import com.cursorraffle.backend.repository.SponsorshipApplicationRepository;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

@Component
public class SponsorshipHandler {

    private final SponsorshipApplicationRepository sponsorshipRepository;

    public SponsorshipHandler(SponsorshipApplicationRepository sponsorshipRepository) {
        this.sponsorshipRepository = sponsorshipRepository;
    }

    public Mono<ServerResponse> createApplication(ServerRequest request) {
        return request.bodyToMono(SponsorshipApplication.class)
                .flatMap(app -> {
                    app.setStatus("PENDING");
                    app.setCreatedAt(LocalDateTime.now());
                    app.setUpdatedAt(LocalDateTime.now());
                    return sponsorshipRepository.save(app)
                            .flatMap(saved -> ServerResponse.ok()
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .bodyValue(saved));
                });
    }

    public Mono<ServerResponse> getActiveSponsorships(ServerRequest request) {
        return sponsorshipRepository.findByStatus("APPROVED")
                .collectList()
                .flatMap(list -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(list));
    }
}

