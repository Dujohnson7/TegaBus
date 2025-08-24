package rw.ac.auca.tegabus_server.core.destination.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import rw.ac.auca.tegabus_server.core.base.AbstractBaseEntity;
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.util.district.EDistrictState;

@Entity
@Getter
@Setter
public class Destination extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "express_id")
    private Express express;

    @Column(name = "fromLocation", nullable = false)
    private EDistrictState fromLocation;

    @Column(name = "toLocation", nullable = false)
    private EDistrictState toLocation;

    @Column(name = "cost", nullable = false)
    private double cost;

}
