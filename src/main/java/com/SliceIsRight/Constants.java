package com.SliceIsRight;

public class Constants {
    public static final String ADMIN_PRIVILEGES = "Admin";
    public static final long ADMIN_TOKEN_DURATION = 720L; // 12 hours
    public static final String USER_PRIVILEGES  = "User";
    public static final long USER_TOKEN_DURATION = 30L; // 1/2 hour
    
    public static final String ENV_ADMIN_SETUP_TOKEN = "ADMIN_SETUP_TOKEN";
    public static final String ENV_JWT_SIGNING_KEY = "JWT_SIGNING_KEY";
    
    public static final String HEADER_ADMIN_SETUP_TOKEN = "X-Admin-Setup-Token";
}
