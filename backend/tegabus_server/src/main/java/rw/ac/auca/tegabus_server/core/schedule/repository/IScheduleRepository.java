package rw.ac.auca.tegabus_server.core.schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.schedule.model.Schedule;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IScheduleRepository extends JpaRepository<Schedule, UUID> {

    @Query("SELECT sch FROM Schedule sch JOIN sch.destination dest  WHERE sch.express.id = :expressId AND dest.id = :destinationId AND sch.active = :active ORDER BY sch.date DESC")
    List<Schedule> findSchedulesByExpressAndDestinationAndActive(
            @Param("expressId") UUID expressId,
            @Param("destinationId") UUID destinationId,
            @Param("active") Boolean active
    );

    @Query("SELECT sch FROM Schedule sch WHERE sch.express.id = :expressId AND sch.active = :active ORDER BY sch.date DESC ")
    List<Schedule> findSchedulesByExpress_IdAndActive(@Param("expressId") UUID expressId, @Param("active") Boolean active);

    Optional<Schedule> findSchedulesByIdAndActive(UUID id, Boolean active);

    @Query("SELECT sch FROM Schedule sch WHERE sch.express.id = :expressId AND sch.bus.users.id = :driverId AND sch.active = :active ORDER BY sch.date DESC")
    List<Schedule> findSchedulesByExpress_IdAndDriver_IdAndActive(@Param("expressId") UUID expressId, @Param("driverId") UUID driverId, @Param("active") Boolean active);

    List<Schedule> findAllByActive(Boolean active);

    @Query(value = "SELECT sch.* FROM schedule sch " +
            "JOIN bus b ON sch.pilate_no = b.id " +
            "WHERE sch.date = CURRENT_DATE " +
            "AND CAST(sch.time AS TIME) > CURRENT_TIME " +
            "AND b.bus_size > (SELECT COUNT(t.id) FROM ticket t WHERE t.schedule_id = sch.id AND t.active = true) " +
            "AND sch.active = :active " +
            "ORDER BY sch.date DESC", nativeQuery = true)
    List<Schedule> findAllByCurrentDateAndAvailableSeats(@Param("active") Boolean active);



}
