package rw.ac.auca.tegabus_server.core.schedule.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import rw.ac.auca.tegabus_server.core.schedule.model.Schedule;
import rw.ac.auca.tegabus_server.core.schedule.repository.IScheduleRepository;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements IScheduleService {

    private final IScheduleRepository scheduleRepository;

    @Override
    public Schedule registerSchedule(Schedule theSchedule) {
        return scheduleRepository.save(theSchedule);
    }

    @Override
    public Schedule updateSchedule(Schedule theSchedule) {
        Schedule found = findScheduleByIdAndState(theSchedule.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setDestination(theSchedule.getDestination());
            found.setBus(theSchedule.getBus());
            found.setTime(theSchedule.getTime());
            return scheduleRepository.save(found);
        }
        throw new ObjectNotFoundException(Schedule.class, "Schedule Not Found");
    }

    @Override
    public Schedule deleteSchedule(Schedule theSchedule) {
        Schedule found = findScheduleByIdAndState(theSchedule.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return scheduleRepository.save(found);
        }
        throw new ObjectNotFoundException(Schedule.class, "Schedule Not Found");
    }

    @Override
    public Schedule findScheduleByIdAndState(UUID id, Boolean state) {
        Schedule theSchedule = scheduleRepository.findSchedulesByIdAndActive(id, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(Schedule.class,"Schedule Not Found"));
        return theSchedule;
    }

    @Override
    public List<Schedule> findAllSchedulesByExpress_IdAndState(UUID expressId, Boolean state) {
        return scheduleRepository.findSchedulesByExpress_IdAndActive(expressId, Boolean.TRUE);
    }

    @Override
    public List<Schedule> findAllByState(Boolean state) {
        return scheduleRepository.findAllByActive(Boolean.TRUE);
    }
}
