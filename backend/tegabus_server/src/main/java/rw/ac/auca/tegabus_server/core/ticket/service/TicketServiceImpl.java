package rw.ac.auca.tegabus_server.core.ticket.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;
import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;
import rw.ac.auca.tegabus_server.core.ticket.repository.ITicketRepository;
import rw.ac.auca.tegabus_server.core.util.ticket.ETicketPayState;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements ITicketService {

    private final ITicketRepository ticketRepository;

    @Override
    public Ticket registerTicket(Ticket theTicket) {
        theTicket.setTickeNumber(generateTicketNumber());
        return ticketRepository.save(theTicket);

    }


    public Integer generateTicketNumber(){
        return (int)(System.currentTimeMillis() % 10000);
    }

    @Override
    public Ticket updateTicket(Ticket theTicket) {
        Ticket found = findTicketByIdAndState(theTicket.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setNames(theTicket.getNames());
            found.setPhone(theTicket.getPhone());
            found.setExpress(theTicket.getExpress());
            found.setSchedule(theTicket.getSchedule());
            found.setBusPlateNo(theTicket.getBusPlateNo());
            found.setSeatNo(theTicket.getSeatNo());
            found.setTotalAmount(theTicket.getTotalAmount());
            found.setDate(theTicket.getDate());
            found.setPayState(theTicket.getPayState());
            return ticketRepository.save(found);
        }
        throw new ObjectNotFoundException(Ticket.class, "Ticket Not Found");
    }

    @Override
    public Ticket deleteTicket(Ticket theTicket) {
        Ticket found = findTicketByIdAndState(theTicket.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return ticketRepository.save(found);
        }
        throw new ObjectNotFoundException(Ticket.class, "Ticket Not Found");
    }

    @Override
    public Ticket findTicketByIdAndState(UUID id, Boolean state) {
        Ticket theTicket = ticketRepository.findTicketByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(() -> new ObjectNotFoundException(Ticket.class,"Ticket Not Found"));
        return theTicket;
    }

    @Override
    public List<Ticket> findAllTicketsByExpressIdAndState(UUID expressId, Boolean state) {
        return ticketRepository.findAllTicketsAndExpressAndActive(expressId, Boolean.TRUE);
    }

    @Override
    public List<Ticket> findAllTicketsByDateBetween(Date start, Date end) {
        return ticketRepository.findTicketByDateBetween(start, end);
    }

    @Override
    public List<Ticket> findAllTicketsByExpressIdAndDateBetween(UUID expressId, Date start, Date end) {
        return ticketRepository.findAllByExpress_IdAndDateBetween(expressId, start, end);
    }

    @Override
    public List<Ticket> findAllByState(Boolean state) {
        return ticketRepository.findAllByActive(Boolean.TRUE);
    }
}
