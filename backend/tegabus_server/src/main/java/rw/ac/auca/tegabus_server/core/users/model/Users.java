package rw.ac.auca.tegabus_server.core.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import rw.ac.auca.tegabus_server.core.base.AbstractBaseEntity;
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.util.role.ERoleState;

@Entity
@Getter
@Setter
public class Users extends AbstractBaseEntity {
    @Column(name = "national_id",  nullable = false)
    private String nid;

    @Column(name = "profile", nullable = true)
    private String profile;

    @Column(name = "names", nullable = false)
    private String names;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "user_role", nullable = true)
    @Enumerated(EnumType.STRING)
    private ERoleState role;

    @ManyToOne
    @JoinColumn(name = "user_express")
    private Express express;

}
