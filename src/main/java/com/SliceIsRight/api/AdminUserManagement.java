package com.SliceIsRight.api;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.ws.rs.POST;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.SliceIsRight.database.entities.UserAccount;
import com.SliceIsRight.Helper;
import com.SliceIsRight.api.model.UserDTO;
import com.SliceIsRight.api.responses.ResponseFactory;

@Path("/admin/user")
public class AdminUserManagement 
{
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Helper helper = new Helper();

    @ConfigProperty(name = "admin.setup.token")
    String adminSetupToken;
    
    public static class UserDataRequest {
        public String email;
        public String password;
        public String token;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response CreateAdminUser(@HeaderParam("X-Admin-Setup-Token") String token, UserDataRequest request) {
        try {
            if (token == null || !token.equals(adminSetupToken)) {
                throw new WebApplicationException(String.format("Admin create user requires a token", request.email), Response.Status.UNAUTHORIZED);
            }

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
                .jwtToken(helper.getJwtToken(user))
                .build();

            return ResponseFactory.GetCreatedResponse(userDTO, String.format("Succesfully created User Ingredient with email %s", request.email));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to create User with email %s", request.email));
        }
    }

    @DELETE
    @Path("/{userToDelete}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed({"Admin"})
    public Response DeleteAdminUser(@PathParam("userToDelete") long userToDelete) {
        try {
            UserAccount adminUser = (UserAccount) Optional.ofNullable(UserAccount.findById(userToDelete))
                .orElseThrow(() -> new WebApplicationException(String.format("Admin Useraccount not found to delete with id %s", userToDelete), Response.Status.NOT_FOUND));
            
            adminUser.delete();
            UserAccount.flush();

            UserDTO userDTO = UserDTO.builder()
                .email(adminUser.email)
                .build();

            return ResponseFactory.GetOkResponse(userDTO, String.format("Succesfully deleted Admin Useraccount with id %s", userToDelete));
        } catch (WebApplicationException e) {
            return ResponseFactory.GetWebExceptionResponse(e);
        } catch (Exception e) {
            return ResponseFactory.GetBadRequestResponse(e, String.format("Failed to deleted Admin Useraccount with id %s", userToDelete));
        }
    }
}

