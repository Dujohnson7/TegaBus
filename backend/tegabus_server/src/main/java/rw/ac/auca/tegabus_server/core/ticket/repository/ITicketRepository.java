package rw.ac.auca.tegabus_server.core.ticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket,UUID> {

    Optional<Ticket> findTicketByIdAndActive(UUID id, Boolean state);

    List<Ticket> findTicketByDateBetween(Date start, Date end);

    @Query("SELECT t FROM Ticket t WHERE t.express =: expressId AND t.active =: active")
    List<Ticket> findAllTicketsAndExpressAndActive(@Param("expressId")  UUID expressId, @Param("active")Boolean active);

    List<Ticket> findAllByActive(Boolean active);

    List<Ticket> findAllByExpress_IdAndDateBetween(UUID expressId, Date start, Date end);

    @Query("SELECT t FROM Ticket t WHERE t.express.id = :expressId")
    List<Ticket> findAllByExpress(@Param("expressId") UUID expressId);

}
