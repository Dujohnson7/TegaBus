package rw.ac.auca.tegabus_server.core.users.service;

import rw.ac.auca.tegabus_server.core.users.model.Users;
import rw.ac.auca.tegabus_server.core.util.role.ERoleState;

import java.util.List;
import java.util.UUID;

public interface IUsersService {
    Users registerUsers(Users theUsers);
    Users updateUsers(Users theUsers);
    Users deleteUsers(Users theUsers);
    Users findUsersByIdAndState(UUID id, Boolean state);
    Users findUserByUsernameAndState(String username, Boolean state);
    List<Users> findAllByExpress_IdAndState(UUID express_id, Boolean state);
    List<Users> findAllByState(Boolean state);
    Users findUserByEmailAndState(String email, Boolean state);
    List<Users> findAllByRoleAndState(ERoleState role, Boolean state);
    List<Users> getUsersByExpressId(UUID express_id);
}
