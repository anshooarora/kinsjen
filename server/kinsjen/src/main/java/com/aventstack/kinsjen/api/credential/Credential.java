package com.aventstack.kinsjen.api.credential;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
@Entity
@Table(name = "credential")
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long jenkinsInstanceId;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt = new Date();

    @NotBlank(message = "Missing mandatory field 'name'")
    private String name;

    @NotBlank(message = "Missing mandatory field 'user'")
    private String username;

    @NotBlank(message = "Missing mandatory field 'apiToken'")
    @Column(name = "api_token")
    private String apiToken;

}
