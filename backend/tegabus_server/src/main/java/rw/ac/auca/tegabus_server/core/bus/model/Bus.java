package rw.ac.auca.tegabus_server.core.bus.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import rw.ac.auca.tegabus_server.core.base.AbstractBaseEntity;
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.users.model.Users;

@Entity
@Getter
@Setter
public class Bus extends AbstractBaseEntity {

    @Column(name = "plateNo", nullable = false)
    private String plateNo;

    @Column(name = "bus_name", nullable = false)
    private String busName;

    @Column(name = "bus_size", nullable = false)
    private int busSize;

    @OneToOne
    @JoinColumn(name = "driver")
    private Users users;

    @ManyToOne
    @JoinColumn(name = "express_id")
    private Express express;

}
