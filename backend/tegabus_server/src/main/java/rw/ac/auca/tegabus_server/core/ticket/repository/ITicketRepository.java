package rw.ac.auca.tegabus_server.core.ticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;
import rw.ac.auca.tegabus_server.core.util.ticket.ETicketPayState;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket,UUID> {

    Optional<Ticket> findTicketByIdAndActive(UUID id, Boolean state);

    List<Ticket> findTicketByDateBetween(Date start, Date end);

    @Query("SELECT t FROM Ticket t WHERE t.express.id = :expressId AND t.active = :active  ORDER BY t.created DESC")
    List<Ticket> findAllTicketsAndExpressAndActive(@Param("expressId") UUID expressId, @Param("active") Boolean active);

    List<Ticket> findAllByExpressIdAndActive(UUID expressId, Boolean active);

    List<Ticket> findAllByActive(Boolean active);

    List<Ticket> findAllByExpress_IdAndDateBetweenAndActive(UUID expressId, Date start, Date end, Boolean active);

    @Query("SELECT t FROM Ticket t WHERE t.express.id = :expressId")
    List<Ticket> findAllByExpress(@Param("expressId") UUID expressId);

    @Query("SELECT t FROM Ticket t WHERE t.schedule.destination = :destination AND t.date BETWEEN :start AND :end AND t.active = :active  ORDER BY t.created DESC ")
    List<Ticket> findAllByDestinationAndDateBetweenAndActive(
            @Param("destination") String destination,
            @Param("start") Date start,
            @Param("end") Date end,
            @Param("active") Boolean active
    );

    @Query("SELECT t FROM Ticket t WHERE t.schedule.destination = :destination AND t.active = :active  AND t.date BETWEEN :start AND :end AND t.payState =:payState  ORDER BY t.created DESC")
    List<Ticket> findAllByDestinationAndDateBetweenAndPayStateAndActive (
            @Param("destination") String destination,
            @Param("start") Date start,
            @Param("end") Date end,
            @Param("payState") ETicketPayState payState,
            @Param("active") Boolean active
    );

    @Query("SELECT DISTINCT t.schedule.destination FROM Ticket t")
    List<String> findAllDestinations();

}
