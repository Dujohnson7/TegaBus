package rw.ac.auca.tegabus_server.core.destination.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.destination.model.Destination;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IDestinationRepository extends JpaRepository<Destination, UUID> {

    Optional<Destination> findDestinationByIdAndActive(UUID id, Boolean active);
    List<Destination> findAllDestinationsByExpress_IdAndActive(UUID express_id, Boolean active);
    List<Destination> findAllByActive(Boolean active);

}
