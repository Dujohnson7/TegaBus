package rw.ac.auca.tegabus_server.core.express.service;

import rw.ac.auca.tegabus_server.core.express.model.Express;

import java.util.List;
import java.util.UUID;

public interface IExpressService {

    Express registerExpress(Express express);

    Express updateExpress(Express express);

    Express deleteExpress(Express express);

    Express findByIdAndState(UUID id, Boolean state);

    List<Express> findAllExpressByState(Boolean state);

}
