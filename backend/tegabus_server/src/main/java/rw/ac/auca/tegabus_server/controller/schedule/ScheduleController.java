package rw.ac.auca.tegabus_server.controller.schedule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.tegabus_server.core.schedule.model.Schedule;
import rw.ac.auca.tegabus_server.core.schedule.service.IScheduleService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final IScheduleService scheduleService;

    @GetMapping("/all")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));
            boolean isDriver = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_DRIVER"));

            List<Schedule> schedules;
            if (isSuperAdmin) {
                schedules = scheduleService.findAllByState(Boolean.TRUE);
            } else if (isDriver) {
                schedules = scheduleService.findSchedulesByExpress_IdAndDriver_IdAndState(userDetails.getExpressId(), userDetails.getUserId(), Boolean.TRUE);
            } else {
                schedules = scheduleService.findAllSchedulesByExpress_IdAndState(userDetails.getExpressId(), Boolean.TRUE);
            }
            return ResponseEntity.ok(schedules);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerSchedule(@RequestBody Schedule theSchedule) {
        try {
            if (theSchedule != null && theSchedule.getExpress() != null && theSchedule.getDestination() != null && theSchedule.getBus() != null) {
                Schedule saved = scheduleService.registerSchedule(theSchedule);
                return ResponseEntity.ok(saved);
            } else {
                return ResponseEntity.badRequest().body("Invalid Schedule Data or required fields missing");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Schedule Registration: " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSchedule(@RequestBody Schedule theSchedule, @PathVariable String id) {
        try {
            Schedule existSchedule = scheduleService.findScheduleByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existSchedule)) {
                theSchedule.setId(UUID.fromString(id));
                Schedule updatedSchedule = scheduleService.updateSchedule(theSchedule);
                return ResponseEntity.ok(updatedSchedule);
            } else {
                return ResponseEntity.badRequest().body("Invalid Schedule ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Schedule Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Schedule theSchedule = new Schedule();
                theSchedule.setId(UUID.fromString(id));
                scheduleService.deleteSchedule(theSchedule);
                return ResponseEntity.ok("Schedule Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Schedule ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Schedule Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchedule(@PathVariable String id) {
        try {
            Schedule theSchedule = scheduleService.findScheduleByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theSchedule)) {
                return ResponseEntity.ok(theSchedule);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Schedule: " + ex.getMessage());
        }
    }
}
