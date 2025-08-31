package rw.ac.auca.tegabus_server.core.schedule.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import rw.ac.auca.tegabus_server.core.base.AbstractBaseEntity;
import rw.ac.auca.tegabus_server.core.bus.model.Bus;
import rw.ac.auca.tegabus_server.core.destination.model.Destination;
import rw.ac.auca.tegabus_server.core.express.model.Express;

import java.util.Date;
import java.util.List;


@Entity
@Getter
@Setter
public class Schedule extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "express_id")
    private Express express;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destination;

    @ManyToOne
    @JoinColumn(name = "pilateNo")
    private Bus bus;

    @Column(name = "time", nullable = false)
    private String time;

    @Column(name = "date", nullable = false, columnDefinition = "Date")
    @Temporal(TemporalType.DATE)
    //@JsonFormat(pattern = "yyyy-MM-dd")
    private Date date;

}
