package com.SliceIsRight;

import java.time.Duration;
import java.util.Set;

import com.SliceIsRight.database.entities.UserAccount;

import io.smallrye.jwt.build.Jwt;

public class Helper {
    public static String GetJwtToken(UserAccount user) {
            Set<String> priveleges = Set.of(Constants.USER_PRIVILEGES);
            Duration duration = Duration.ofMinutes(Constants.USER_TOKEN_DURATION);
            if (user.adminPriveleges) {
                priveleges.add(Constants.ADMIN_PRIVILEGES);
                duration = Duration.ofMinutes(Constants.ADMIN_TOKEN_DURATION);
            }
            
            String token = Jwt.issuer("sliceisright")
                    .upn(user.email)
                    .expiresIn(duration)
                    .groups(priveleges)
                    .sign();

            return token;
    }
}
