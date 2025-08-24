package rw.ac.auca.tegabus_server.core.bus.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;
import rw.ac.auca.tegabus_server.core.bus.model.Bus;
import rw.ac.auca.tegabus_server.core.bus.repository.IBusRepository;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusServiceImpl implements IBusService {

    private final IBusRepository busRepository;

    @Override
    public Bus registerBus(Bus theBus) {
        return busRepository.save(theBus);
    }

    @Override
    public Bus updateBus(Bus theBus) {
        Bus found = findBusByIdAndState(theBus.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setPlateNo(theBus.getPlateNo());
            found.setBusName(theBus.getBusName());
            found.setBusSize(theBus.getBusSize());
            found.setUsers(theBus.getUsers());
            return busRepository.save(found);
        }
        throw new ObjectNotFoundException(Bus.class, "Bus Not Found");
    }

    @Override
    public Bus deleteBus(Bus theBus) {
        Bus found = findBusByIdAndState(theBus.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return busRepository.save(found);
        }
        throw new ObjectNotFoundException(Bus.class, "Bus Not Found");
    }

    @Override
    public Bus findBusByPlateNoAndState(String plateNo, Boolean state) {
        Bus theBus = busRepository.findBusByPlateNoAndActive(plateNo, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(Bus.class,"Bus Not Found"));
        return theBus;
    }

    @Override
    public Bus findBusByIdAndState(UUID id, Boolean state) {
        Bus theBus = busRepository.findBusByIdAndActive(id, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(Bus.class,"Bus Not Found"));
        return theBus;
    }

    @Override
    public List<Bus> findAllBusAndExpress_IdAndState(UUID expressId, Boolean state) {
        return busRepository.findBusByExpressIdAndActive(expressId, state);
    }

    @Override
    public List<Bus> findAllByState(Boolean state) {
        return busRepository.findAllByActive(Boolean.TRUE);
    }
}
