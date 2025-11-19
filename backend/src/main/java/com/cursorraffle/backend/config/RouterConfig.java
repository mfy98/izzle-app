package com.cursorraffle.backend.config;

import com.cursorraffle.backend.handler.AdminHandler;
import com.cursorraffle.backend.handler.AuthHandler;
import com.cursorraffle.backend.handler.SponsorshipHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> authRoutes(AuthHandler authHandler) {
        return route(POST("/api/auth/login").and(accept(MediaType.APPLICATION_JSON)), authHandler::login)
                .andRoute(POST("/api/auth/register/advertiser").and(accept(MediaType.APPLICATION_JSON)), authHandler::registerAdvertiser)
                .andRoute(POST("/api/auth/register/user").and(accept(MediaType.APPLICATION_JSON)), authHandler::registerUser)
                .andRoute(POST("/api/auth/register/admin").and(accept(MediaType.APPLICATION_JSON)), authHandler::registerAdmin);
    }

    @Bean
    public RouterFunction<ServerResponse> adminRoutes(AdminHandler adminHandler) {
        return route(GET("/api/admin/analytics"), adminHandler::getAnalytics)
                .andRoute(GET("/api/admin/advertisers/pending"), adminHandler::getPendingAdvertisers)
                .andRoute(PUT("/api/admin/advertisers/{id}/approve"), adminHandler::approveAdvertiser);
    }

    @Bean
    public RouterFunction<ServerResponse> sponsorshipRoutes(SponsorshipHandler sponsorshipHandler) {
        return route(POST("/api/sponsorship/apply").and(accept(MediaType.APPLICATION_JSON)), sponsorshipHandler::createApplication)
                .andRoute(GET("/api/sponsorship/active"), sponsorshipHandler::getActiveSponsorships);
    }
}
