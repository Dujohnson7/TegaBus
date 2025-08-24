package rw.ac.auca.tegabus_server.core.bus.service;


import rw.ac.auca.tegabus_server.core.bus.model.Bus;

import java.util.List;
import java.util.UUID;

public interface IBusService {

    Bus registerBus(Bus theBus);
    Bus updateBus(Bus theBus);
    Bus deleteBus(Bus theBus);
    Bus findBusByPlateNoAndState(String plateNo, Boolean state);
    Bus findBusByIdAndState(UUID id, Boolean state);
    List<Bus> findAllBusAndExpress_IdAndState(UUID express_id, Boolean state);
    List<Bus> findAllByState(Boolean state);
}
