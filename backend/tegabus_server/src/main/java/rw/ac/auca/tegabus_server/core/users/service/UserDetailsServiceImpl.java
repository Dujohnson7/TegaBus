package rw.ac.auca.tegabus_server.core.users.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import rw.ac.auca.tegabus_server.core.users.model.Users;
import rw.ac.auca.tegabus_server.core.users.repository.IUsersRepository;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final IUsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = usersRepository.findUserByEmailAndActive(email, Boolean.TRUE)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new UserDetailsImpl(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority),
                user.getId(),
                user.getExpress() != null ? user.getExpress().getId() : null
        );
    }
}