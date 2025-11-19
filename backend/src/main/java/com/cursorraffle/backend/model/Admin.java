package com.cursorraffle.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("admins")
public class Admin {
    @Id
    private Long id;
    private String email;
    private String password;
    private String name;
    private String surname;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

