package rw.ac.auca.tegabus_server.core.express.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.ac.auca.tegabus_server.core.express.model.Express;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IExpressRepository extends JpaRepository<Express, UUID> {
    Optional<Express> findByExpressNameAndActive(String expressName, Boolean active);
    Optional<Express> findByIdAndActive(UUID id, Boolean active);
    List<Express> findExpressByActive(Boolean active);
}
