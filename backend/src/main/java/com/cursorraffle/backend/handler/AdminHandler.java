package com.cursorraffle.backend.handler;

import com.cursorraffle.backend.model.Advertiser;
import com.cursorraffle.backend.model.SponsorshipApplication;
import com.cursorraffle.backend.repository.AdvertiserRepository;
import com.cursorraffle.backend.repository.SponsorshipApplicationRepository;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

@Component
public class AdminHandler {

    private final AdvertiserRepository advertiserRepository;
    private final SponsorshipApplicationRepository sponsorshipRepository;

    public AdminHandler(AdvertiserRepository advertiserRepository, SponsorshipApplicationRepository sponsorshipRepository) {
        this.advertiserRepository = advertiserRepository;
        this.sponsorshipRepository = sponsorshipRepository;
    }

    public Mono<ServerResponse> getAnalytics(ServerRequest request) {
        return advertiserRepository.count()
                .flatMap(totalAdvertisers -> 
                    sponsorshipRepository.count()
                            .flatMap(totalApplications -> 
                                ServerResponse.ok()
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .bodyValue(Map.of(
                                                "totalAdvertisers", totalAdvertisers,
                                                "totalApplications", totalApplications,
                                                "totalImpressions", 0, // TODO: Calculate from ad views
                                                "sprintImpressions", Map.of() // TODO: Group by sprint
                                        ))
                            )
                );
    }

    public Mono<ServerResponse> approveAdvertiser(ServerRequest request) {
        Long advertiserId = Long.parseLong(request.pathVariable("id"));
        return advertiserRepository.findById(advertiserId)
                .flatMap(advertiser -> {
                    advertiser.setIsVerified(true);
                    advertiser.setUpdatedAt(LocalDateTime.now());
                    return advertiserRepository.save(advertiser)
                            .flatMap(saved -> ServerResponse.ok()
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .bodyValue(saved));
                })
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getPendingAdvertisers(ServerRequest request) {
        return advertiserRepository.findAll()
                .filter(adv -> !Boolean.TRUE.equals(adv.getIsVerified()))
                .collectList()
                .flatMap(list -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(list));
    }
}

