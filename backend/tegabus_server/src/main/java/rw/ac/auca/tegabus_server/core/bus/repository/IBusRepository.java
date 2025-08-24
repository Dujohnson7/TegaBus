package rw.ac.auca.tegabus_server.core.bus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.bus.model.Bus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IBusRepository extends JpaRepository<Bus, UUID> {

    //@Query("SELECT b FROM Bus b WHERE b.express.id =: expressId AND  b.active =: active")
   // List<Bus> findBusByExpressIdAndActive(@Param("expressId") UUID expressId, @Param("active") Boolean active);

    Optional<Bus> findBusByPlateNoAndActive(String plateNo, Boolean active);

    Optional<Bus> findBusByIdAndActive(UUID id, Boolean active);

    @Query("SELECT b FROM Bus b WHERE b.express.id = :expressId AND b.active = :state")
    List<Bus> findBusByExpressIdAndActive(@Param("expressId") UUID expressId, @Param("state") Boolean active);


    List<Bus> findAllByActive(Boolean active);

}
