package rw.ac.auca.tegabus_server.core.users.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rw.ac.auca.tegabus_server.core.users.model.Users;
import rw.ac.auca.tegabus_server.core.users.repository.IUsersRepository;
import rw.ac.auca.tegabus_server.core.util.role.ERoleState;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements IUsersService {

    private final IUsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Users registerUsers(Users theUsers) {

        theUsers.setPassword(passwordEncoder.encode(theUsers.getPassword()));
        theUsers.setProfile("person.png");

        return usersRepository.save(theUsers);
    }

    @Override
    public Users updateUsers(Users theUsers) {
        Users found = findUsersByIdAndState(theUsers.getId(), Boolean.TRUE);
        if(Objects.nonNull(found)){
            found.setNames(theUsers.getNames());
            found.setPhone(theUsers.getPhone());
            found.setUsername(theUsers.getUsername());
            found.setEmail(theUsers.getEmail());
            found.setPassword(theUsers.getPassword());
            found.setProfile(theUsers.getProfile());
            found.setEmail(theUsers.getEmail());
            found.setRole(theUsers.getRole());
            found.setExpress(theUsers.getExpress());
            if (theUsers.getPassword() != null && !theUsers.getPassword().isEmpty()) {
                found.setPassword(passwordEncoder.encode(theUsers.getPassword()));
            }
            return usersRepository.save(found);
        }
        throw new ObjectNotFoundException(Users.class,"Users not found");
    }

    @Override
    public Users deleteUsers(Users theUsers) {
        Users found = findUsersByIdAndState(theUsers.getId(), Boolean.TRUE);
        if(Objects.nonNull(found)){
            found.setActive(Boolean.FALSE);
            return usersRepository.save(found);
        }
        throw new ObjectNotFoundException(Users.class,"Users not found");
    }

    @Override
    public Users findUsersByIdAndState(UUID id, Boolean state) {
        Users theUsers = usersRepository.findUserByIdAndActive(id, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(Users.class, "User Not Found"));
        return theUsers;
    }

    @Override
    public Users findUserByUsernameAndState(String username, Boolean state) {
        Users theUsers = usersRepository.findUserByUsernameAndActive(username, state)
                .orElseThrow( () -> new ObjectNotFoundException(Users.class, "User Not Found"));
        return theUsers;
    }

    @Override
    public List<Users> findAllByExpress_IdAndState(UUID express_id, Boolean state) {
        return usersRepository.findAllUsersByExpressIdAndActive(express_id, Boolean.TRUE);
    }

    @Override
    public List<Users> findAllByState(Boolean state) {
        return usersRepository.findUsersByActive(Boolean.TRUE);
    }

    @Override
    public Users findUserByEmailAndState(String email, Boolean state) {
        Users theUsers = usersRepository.findUserByEmailAndActive(email, state)
                .orElseThrow( () -> new ObjectNotFoundException(Users.class, "User Not Found"));
        return theUsers;
    }


    @Override
    public List<Users> findAllByRoleAndState(ERoleState role, Boolean state) {
        return usersRepository.findUsersByRoleAndActive(role, Boolean.TRUE);
    }

    @Override
    public List<Users> getUsersByExpressId(UUID express_id) {
        return usersRepository.findAllByExpressIdAndActive(express_id);
    }
}
