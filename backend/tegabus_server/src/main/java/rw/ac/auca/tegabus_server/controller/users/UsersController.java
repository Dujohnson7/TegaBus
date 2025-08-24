package rw.ac.auca.tegabus_server.controller.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.tegabus_server.core.users.model.Users;
import rw.ac.auca.tegabus_server.core.users.service.IUsersService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UsersController {

    private final IUsersService usersService;

    @GetMapping("/all")
    public ResponseEntity<List<Users>> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            List<Users> users;
            if (isSuperAdmin) {
                users = usersService.findAllByState(Boolean.TRUE);
            } else {
                users = usersService.getUsersByExpressId(userDetails.getExpressId());
            }
            return ResponseEntity.ok(users);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }




    @PostMapping("/register")
    public ResponseEntity<?> registerUsers(@RequestBody Users theUsers){
        try {
            if (theUsers != null && theUsers.getExpress() != null) {
                Users saved = usersService.registerUsers(theUsers);
                return ResponseEntity.ok(saved);
            } else {
                return ResponseEntity.badRequest().body("Invalid Users Data or Express missing");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Registration: " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUsers(@RequestBody Users theUsers, @PathVariable String id){
        try {
            Users existUsers = usersService.findUsersByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if(!Objects.isNull(existUsers)){
                theUsers.setId(UUID.fromString(id));
                Users updateUsers = usersService.updateUsers(theUsers);
                return ResponseEntity.ok(updateUsers);
            } else {
                return ResponseEntity.badRequest().body("Invalid Users ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Update " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUsers(@PathVariable String id){
        try {
            if(!Objects.isNull(id)){
                Users theUsers = new Users();
                theUsers.setId(UUID.fromString(id));
                usersService.deleteUsers(theUsers);
                return ResponseEntity.ok("Users Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Users ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Delete " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsers(@PathVariable String id){
        try {
            Users theUsers = usersService.findUsersByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if(!Objects.isNull(theUsers)){
                return ResponseEntity.ok(theUsers);
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(" Error Users " + ex.getMessage());
        }
    }
}