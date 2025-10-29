package com.SliceIsRight;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

import org.eclipse.microprofile.jwt.Claims;

import com.SliceIsRight.database.entities.UserAccount;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class Helper {
    public String getJwtToken(UserAccount user) {
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
              .claim(Claims.birthdate.name(), "2001-07-13") 
              .sign();
    }
}
