package rw.ac.auca.tegabus_server.core.destination.service;

import rw.ac.auca.tegabus_server.core.destination.model.Destination;

import java.util.List;
import java.util.UUID;

public interface IDestinationService {
    Destination registerDestination(Destination theDestination);
    Destination updateDestination(Destination theDestination);
    Destination deleteDestination(Destination theDestination);
    Destination findDestinationByIdAndActive(UUID id, Boolean active);
    List<Destination> findAllDestinationsAndExpress_IdAndActive(UUID express_id, Boolean active);
    List<Destination> findAllByState(Boolean state);

}
