package rw.ac.auca.tegabus_server.core.schedule.service;

import rw.ac.auca.tegabus_server.core.schedule.model.Schedule;

import java.util.List;
import java.util.UUID;

public interface IScheduleService {
    Schedule registerSchedule(Schedule theSchedule);
    Schedule updateSchedule(Schedule theSchedule);
    Schedule deleteSchedule(Schedule theSchedule);
    Schedule findScheduleByIdAndState(UUID id, Boolean state);
    List<Schedule> findAllSchedulesByExpress_IdAndState(UUID expressId, Boolean state);
    List<Schedule> findAllByState(Boolean state);
    List<Schedule> findSchedulesByExpress_IdAndDriver_IdAndState(UUID expressId, UUID driverId, Boolean state);
    List<Schedule> findAllByCurrentDateAndAvailableSeats();
}
