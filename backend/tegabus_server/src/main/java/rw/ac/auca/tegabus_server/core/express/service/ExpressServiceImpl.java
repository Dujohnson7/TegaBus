package rw.ac.auca.tegabus_server.core.express.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.express.repository.IExpressRepository;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpressServiceImpl implements IExpressService {

    private final IExpressRepository expressRepository;

    @Override
    public Express registerExpress(Express express) {
        return expressRepository.save(express);
    }

    @Override
    public Express updateExpress(Express express) {
        Express found = findByIdAndState(express.getId(), Boolean.TRUE);
        if(express.getExpressLogo() != null) found.setExpressLogo(express.getExpressLogo());
        if(express.getExpressProfile() != null) found.setExpressProfile(express.getExpressProfile());
        if(express.getExpressName() != null) found.setExpressName(express.getExpressName());
        if(express.getExpressDescription() != null) found.setExpressDescription(express.getExpressDescription());
        return expressRepository.save(found);
    }

    @Override
    public Express deleteExpress(Express express) {
        /*Express found = findByIdAndState(express.getId(), Boolean.TRUE);
        if(Objects.isNull(found)){
            found.setActive(Boolean.FALSE);
            return expressRepository.save(found);
        }
        throw new ObjectNotFoundException(Express.class, "Express not found");*/
        Express found = findByIdAndState(express.getId(), Boolean.TRUE);
        found.setActive(Boolean.FALSE);
        return expressRepository.save(found);
    }

    @Override
    public Express findByIdAndState(UUID id, Boolean state) {
        Express theExpress = expressRepository.findByIdAndActive(id, state)
                .orElseThrow( () -> new ObjectNotFoundException(Express.class, "EXPRESS Not Found"));
        return theExpress;
    }

    @Override
    public List<Express> findAllExpressByState(Boolean state) {
        return expressRepository.findExpressByActive(Boolean.TRUE);
    }
}
