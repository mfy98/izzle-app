package com.cursorraffle.backend.handler;

import com.cursorraffle.backend.model.Admin;
import com.cursorraffle.backend.model.Advertiser;
import com.cursorraffle.backend.model.User;
import com.cursorraffle.backend.repository.AdminRepository;
import com.cursorraffle.backend.repository.AdvertiserRepository;
import com.cursorraffle.backend.repository.UserRepository;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

@Component
public class AuthHandler {

    private final UserRepository userRepository;
    private final AdvertiserRepository advertiserRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthHandler(UserRepository userRepository, AdvertiserRepository advertiserRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.advertiserRepository = advertiserRepository;
        this.adminRepository = adminRepository;
    }

    public Mono<ServerResponse> login(ServerRequest request) {
        return request.bodyToMono(LoginRequest.class)
                .flatMap(loginRequest -> {
                    // 1. Try Admin first
                    return adminRepository.findByEmail(loginRequest.getEmail())
                            .filter(admin -> passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword()))
                            .flatMap(admin -> ServerResponse.ok()
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .bodyValue(Map.of(
                                            "token", "mock-jwt-token-admin-" + admin.getId(),
                                            "role", "admin",
                                            "user", admin
                                    )))
                            .switchIfEmpty(
                                    // 2. Try Advertiser
                                    advertiserRepository.findByContactEmail(loginRequest.getEmail())
                                            .filter(adv -> passwordEncoder.matches(loginRequest.getPassword(), adv.getPassword()))
                                            .flatMap(adv -> {
                                                if (!Boolean.TRUE.equals(adv.getIsVerified())) {
                                                    return ServerResponse.badRequest()
                                                            .bodyValue(Map.of("message", "Hesabınız henüz onaylanmamıştır. Lütfen yönetici onayını bekleyin."));
                                                }
                                                return ServerResponse.ok()
                                                        .contentType(MediaType.APPLICATION_JSON)
                                                        .bodyValue(Map.of(
                                                                "token", "mock-jwt-token-advertiser-" + adv.getId(),
                                                                "role", "advertiser",
                                                                "user", adv
                                                        ));
                                            })
                            )
                            .switchIfEmpty(
                                    // 3. Try User
                                    userRepository.findByEmail(loginRequest.getEmail())
                                            .filter(u -> passwordEncoder.matches(loginRequest.getPassword(), u.getPassword()))
                                            .flatMap(u -> ServerResponse.ok()
                                                    .contentType(MediaType.APPLICATION_JSON)
                                                    .bodyValue(Map.of(
                                                            "token", "mock-jwt-token-user-" + u.getId(),
                                                            "role", "user",
                                                            "user", u
                                                    )))
                            )
                            .switchIfEmpty(ServerResponse.badRequest().bodyValue(Map.of("message", "E-posta veya şifre hatalı.")));
                });
    }

    public Mono<ServerResponse> registerAdvertiser(ServerRequest request) {
        return request.bodyToMono(Advertiser.class)
                .flatMap(advertiser -> {
                    // Check if email exists
                    return advertiserRepository.findByContactEmail(advertiser.getContactEmail())
                            .flatMap(existing -> ServerResponse.badRequest().bodyValue(Map.of("message", "Bu e-posta adresi zaten kayıtlı.")))
                            .switchIfEmpty(Mono.defer(() -> {
                                advertiser.setCreatedAt(LocalDateTime.now());
                                advertiser.setUpdatedAt(LocalDateTime.now());
                                advertiser.setIsVerified(false); // Needs admin approval
                                advertiser.setPassword(passwordEncoder.encode(advertiser.getPassword()));
                                
                                return advertiserRepository.save(advertiser)
                                        .flatMap(saved -> ServerResponse.ok()
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .bodyValue(saved));
                            }));
                });
    }
    
    public Mono<ServerResponse> registerUser(ServerRequest request) {
         return request.bodyToMono(User.class)
                .flatMap(user -> {
                    return userRepository.findByEmail(user.getEmail())
                            .flatMap(existing -> ServerResponse.badRequest().bodyValue(Map.of("message", "Bu e-posta adresi zaten kayıtlı.")))
                            .switchIfEmpty(Mono.defer(() -> {
                                user.setRole("USER"); // Always USER for public registration
                                user.setPassword(passwordEncoder.encode(user.getPassword()));
                                return userRepository.save(user)
                                        .flatMap(saved -> ServerResponse.ok()
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .bodyValue(saved));
                            }));
                });
    }

    public Mono<ServerResponse> registerAdmin(ServerRequest request) {
        return request.bodyToMono(Admin.class)
                .flatMap(admin -> {
                    return adminRepository.findByEmail(admin.getEmail())
                            .flatMap(existing -> ServerResponse.badRequest().bodyValue(Map.of("message", "Bu e-posta adresi zaten kayıtlı.")))
                            .switchIfEmpty(Mono.defer(() -> {
                                admin.setCreatedAt(LocalDateTime.now());
                                admin.setUpdatedAt(LocalDateTime.now());
                                admin.setPassword(passwordEncoder.encode(admin.getPassword()));
                                return adminRepository.save(admin)
                                        .flatMap(saved -> ServerResponse.ok()
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .bodyValue(saved));
                            }));
                });
    }

    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }
}
