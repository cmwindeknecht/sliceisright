package com.SliceIsRight;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.SliceIsRight.database.entities.UserAccount;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class Helper {
    public String getJwtToken(UserAccount user) {
        String key = System.getenv(Constants.ENV_JWT_SIGNING_KEY);
        SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

        Set<String> privileges = new HashSet<>(Set.of(Constants.USER_PRIVILEGES));
        Duration duration = Duration.ofMinutes(Constants.USER_TOKEN_DURATION);
        if (user.adminPriveleges) {
            privileges.add(Constants.ADMIN_PRIVILEGES);
            duration = Duration.ofMinutes(Constants.ADMIN_TOKEN_DURATION);
        }

        return Jwt.issuer("sliceisright")
              .upn(user.email)
              .expiresIn(duration)
              .groups(privileges)
              .sign(secretKey);
    }
}
