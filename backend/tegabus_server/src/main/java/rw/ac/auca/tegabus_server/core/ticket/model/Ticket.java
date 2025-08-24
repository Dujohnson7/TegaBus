package rw.ac.auca.tegabus_server.core.ticket.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import rw.ac.auca.tegabus_server.core.base.AbstractBaseEntity;
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.schedule.model.Schedule;
import rw.ac.auca.tegabus_server.core.util.ticket.ETicketPayState;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Ticket extends AbstractBaseEntity {

    @Column(name = "ticket_number",unique = true, nullable = false,updatable = false)
    private int tickeNumber;

    @Column(name = "names", nullable = false)
    private String names;

    @Column(name = "phone", nullable = false)
    private String phone;


    @ManyToOne
    @JoinColumn(name = "express_id")
    private Express express;

    @ManyToOne
    @JoinColumn(name = "schedule_Id")
    private Schedule schedule;

    @Column(name = "bus_plateNo", nullable = false)
    private String busPlateNo;


    @Column(name = "seatNo", nullable = false)
    private int seatNo;

    @Column(name = "totalAmount", nullable = false)
    private double totalAmount;

    @Column(name = "pay_state", nullable = false)
    @Enumerated(EnumType.STRING)
    private ETicketPayState payState;

    @Column(name = "date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
}
