package rw.ac.auca.tegabus_server.core.destination.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;
import rw.ac.auca.tegabus_server.core.destination.model.Destination;
import rw.ac.auca.tegabus_server.core.destination.repository.IDestinationRepository;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DestinationServiceImpl implements IDestinationService{

    private final IDestinationRepository destinationRepository;

    @Override
    public Destination registerDestination(Destination theDestination) {
        return destinationRepository.save(theDestination);
    }

    @Override
    public Destination updateDestination(Destination theDestination) {
        Destination found = findDestinationByIdAndActive(theDestination.getId(),Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setFromLocation(theDestination.getFromLocation());
            found.setToLocation(theDestination.getToLocation());
            found.setCost(theDestination.getCost());
            return destinationRepository.save(found);
        }
        return null;
    }

    @Override
    public Destination deleteDestination(Destination theDestination) {
        Destination found = findDestinationByIdAndActive(theDestination.getId(),Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return destinationRepository.save(found);
        }
        return null;
    }

    @Override
    public Destination findDestinationByIdAndActive(UUID id, Boolean active) {
        Destination theDestination = destinationRepository.findDestinationByIdAndActive(id, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(Destination.class,"Destination Not Found"));
        return theDestination;
    }

    @Override
    public List<Destination> findAllDestinationsAndExpress_IdAndActive(UUID express_id, Boolean active) {
        return destinationRepository.findAllDestinationsByExpress_IdAndActive(express_id, active);
    }

    @Override
    public List<Destination> findAllByState(Boolean state) {
        return destinationRepository.findAllByActive(Boolean.TRUE);
    }
}
