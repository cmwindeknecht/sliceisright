package com.SliceIsRight.api;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.SliceIsRight.Constants;
import com.SliceIsRight.Helper;
import com.SliceIsRight.api.model.UserDTO;
import com.SliceIsRight.api.responses.ResponseFactory;
import com.SliceIsRight.database.entities.UserAccount;

import io.smallrye.jwt.build.Jwt;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/user")
public class UserManagement {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public static class UserDataRequest {
        public String email;
        public String password;
    }

    @Path("/create")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response Create(UserDataRequest request) {
        try {
            Optional.ofNullable(UserAccount.find("email", request.email)
                .firstResult())
                .ifPresent(existing -> {
                    throw new WebApplicationException(String.format("User with email %s already exists", request.email), Response.Status.BAD_REQUEST);
                });
            UserAccount user = new UserAccount();
            user.email = request.email;
            user.hashedPassword = passwordEncoder.encode(request.password);
            user.persist();

            UserDTO userDTO = UserDTO.builder()
                .email(user.email)
                .jwtToken(Helper.GetJwtToken(user))
                .build();

            return ResponseFactory.GetCreatedResponse(userDTO, String.format("Succesfully created User Ingredient with email %s", request.email));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to create User with email %s", request.email));
        }
    }

    @Path("/emailLogin")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response EmailLogin(UserDataRequest request) {
        try {
            UserAccount user = (UserAccount) Optional.ofNullable(UserAccount.find("email", request.email))
                .orElseThrow(() -> new WebApplicationException(String.format("User not found with email %s", request.email), Response.Status.NOT_FOUND));
          
            if (!passwordEncoder.matches(request.password, user.hashedPassword)) {
                throw new Exception("Password does not match");
            }

            UserDTO userDTO = UserDTO.builder()
                .email(user.email)
                .jwtToken(Helper.GetJwtToken(user))
                .build();

            return ResponseFactory.GetOkResponse(userDTO, String.format("Succesfully logged in User with email %s", request.email));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to log in User with email %s", request.email));
        }
    }
}
