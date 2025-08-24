package rw.ac.auca.tegabus_server.core.ticket.service;

import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface ITicketService {
    Ticket registerTicket(Ticket theTicket);
    Ticket updateTicket(Ticket theTicket);
    Ticket deleteTicket(Ticket theTicket);
    Ticket findTicketByIdAndState(UUID id, Boolean state);
    List<Ticket> findAllTicketsByExpressIdAndState(UUID expressId, Boolean state);
    List<Ticket> findAllTicketsByDateBetween(Date start, Date end);
    List<Ticket> findAllTicketsByExpressIdAndDateBetween(UUID expressId, Date start, Date end);
    List<Ticket> findAllByState(Boolean state);

}
