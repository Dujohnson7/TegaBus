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

    @Query("SELECT sch FROM Schedule sch JOIN sch.destination dest  WHERE sch.express.id = :expressId AND dest.id = :destinationId AND sch.active = :active")
    List<Schedule> findSchedulesByExpressAndDestinationAndActive(
            @Param("expressId") UUID expressId,
            @Param("destinationId") UUID destinationId,
            @Param("active") Boolean active
    );

    @Query("SELECT sch FROM Schedule sch WHERE sch.express.id = :expressId AND sch.active = :active")
    List<Schedule> findSchedulesByExpress_IdAndActive(@Param("expressId") UUID expressId, @Param("active") Boolean active);

    Optional<Schedule> findSchedulesByIdAndActive(UUID id, Boolean active);

    List<Schedule> findAllByActive(Boolean active);


}
