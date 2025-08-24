package rw.ac.auca.tegabus_server.core.users.service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.UUID;

public class UserDetailsImpl extends User {

    private final UUID userId;
    private final UUID expressId;

    public UserDetailsImpl(String email, String password,
                           Collection<? extends GrantedAuthority> authorities,
                           UUID userId, UUID expressId) {
        super(email, password, authorities);
        this.userId = userId;
        this.expressId = expressId;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getExpressId() {
        return expressId;
    }
}
