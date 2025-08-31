package rw.ac.auca.tegabus_server.controller.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.tegabus_server.core.bus.model.Bus;
import rw.ac.auca.tegabus_server.core.bus.service.IBusService;
import rw.ac.auca.tegabus_server.core.destination.model.Destination;
import rw.ac.auca.tegabus_server.core.destination.service.IDestinationService;
import rw.ac.auca.tegabus_server.core.schedule.model.Schedule;
import rw.ac.auca.tegabus_server.core.schedule.service.IScheduleService;
import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;
import rw.ac.auca.tegabus_server.core.ticket.service.ITicketService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {

    private final ITicketService ticketService;
    private final IScheduleService scheduleService;
    private final IBusService busService;
    private final IDestinationService destinationService;

    @GetMapping("/all")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        System.out.println("Principal: " + principal);
        System.out.println("Authorities: " + authentication.getAuthorities());

        if (principal instanceof UserDetailsImpl userDetails) {
            System.out.println("User Express ID: " + userDetails.getExpressId());
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            System.out.println("Is Super Admin: " + isSuperAdmin);

            List<Ticket> tickets;
            if (isSuperAdmin) {
                tickets = ticketService.findAllByState(Boolean.TRUE);
            } else {
                tickets = ticketService.findAllTicketsByExpressIdAndState(userDetails.getExpressId(), Boolean.TRUE);
            }
            return ResponseEntity.ok(tickets);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/bus")
    public ResponseEntity<List<Bus>> getAllBuses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            List<Bus> buses;
            if (isSuperAdmin) {
                buses = busService.findAllByState(Boolean.TRUE);
            } else {
                buses = busService.findAllBusAndExpress_IdAndState(userDetails.getExpressId(), Boolean.TRUE);
            }
            return ResponseEntity.ok(buses);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            List<Schedule> schedules;
            if (isSuperAdmin) {
                schedules = scheduleService.findAllByState(Boolean.TRUE);
            } else {
                schedules = scheduleService.findAllSchedulesByExpress_IdAndState(userDetails.getExpressId(), Boolean.TRUE);
            }
            return ResponseEntity.ok(schedules);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @GetMapping("/destination")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            List<Destination> destinations;
            if (isSuperAdmin) {
                destinations = destinationService.findAllByState(Boolean.TRUE);
            } else {
                destinations = destinationService.findAllDestinationsAndExpress_IdAndActive(userDetails.getExpressId(), Boolean.TRUE);
            }
            return ResponseEntity.ok(destinations);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerTicket(@RequestBody Ticket theTicket) {
        try {
            if (theTicket != null && theTicket.getExpress() != null && theTicket.getSchedule() != null) {
                Ticket saved = ticketService.registerTicket(theTicket);
                return ResponseEntity.ok(saved);
            } else {
                return ResponseEntity.badRequest().body("Invalid Ticket Data or required fields missing");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Ticket Registration: " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTicket(@RequestBody Ticket theTicket, @PathVariable String id) {
        try {
            Ticket existTicket = ticketService.findTicketByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existTicket)) {
                theTicket.setId(UUID.fromString(id));
                Ticket updatedTicket = ticketService.updateTicket(theTicket);
                return ResponseEntity.ok(updatedTicket);
            } else {
                return ResponseEntity.badRequest().body("Invalid Ticket ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Ticket Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Ticket theTicket = new Ticket();
                theTicket.setId(UUID.fromString(id));
                ticketService.deleteTicket(theTicket);
                return ResponseEntity.ok("Ticket Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Ticket ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Ticket Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(@PathVariable String id) {
        try {
            Ticket theTicket = ticketService.findTicketByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theTicket)) {
                return ResponseEntity.ok(theTicket);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Ticket: " + ex.getMessage());
        }
    }
}
