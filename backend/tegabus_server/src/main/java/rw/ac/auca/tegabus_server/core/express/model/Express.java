package rw.ac.auca.tegabus_server.core.express.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import rw.ac.auca.tegabus_server.core.base.AbstractBaseEntity;

@Entity
@Getter
@Setter
public class Express extends AbstractBaseEntity {

    @Column(name = "express_logo", nullable = true, unique = true)
    private String expressLogo;

    @Column(name = "express_profile", nullable = true, unique = true)
    private String expressProfile;

    @Column(name = "express_name", nullable = false, unique = true)
    private String expressName;

    @Column(name = "express_description", nullable = false, columnDefinition = "TEXT")
    private String expressDescription;
}
