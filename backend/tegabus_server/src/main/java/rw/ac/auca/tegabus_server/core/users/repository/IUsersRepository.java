package rw.ac.auca.tegabus_server.core.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.users.model.Users;
import rw.ac.auca.tegabus_server.core.util.role.ERoleState;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IUsersRepository extends JpaRepository<Users, UUID> {

    @Query("SELECT u FROM Users u WHERE u.express =: expressId AND u.active =: active ")
    List<Users> findAllUsersByExpressIdAndActive(@Param("expressId") UUID expressId, @Param("active") Boolean active);

    @Query("SELECT u FROM Users u WHERE u.express.id = :expressId AND u.active = true")
    List<Users> findAllByExpressIdAndActive(@Param("expressId") UUID expressId);

    List<Users> findUsersByActive(Boolean active);

    Optional<Users> findUserByUsernameAndActive(String username, Boolean active);

    Optional<Users> findUserByEmailAndActive(String email, Boolean active);

    Optional<Users> findUserByIdAndActive(UUID id, Boolean active);

    List<Users> findUsersByRoleAndActive(ERoleState role, Boolean active);
}
