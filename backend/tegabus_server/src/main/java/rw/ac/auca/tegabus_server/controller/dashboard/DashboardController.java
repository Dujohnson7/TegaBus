package rw.ac.auca.tegabus_server.controller.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rw.ac.auca.tegabus_server.core.bus.model.Bus;
import rw.ac.auca.tegabus_server.core.bus.service.IBusService;
import rw.ac.auca.tegabus_server.core.destination.model.Destination;
import rw.ac.auca.tegabus_server.core.destination.service.IDestinationService;
import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;
import rw.ac.auca.tegabus_server.core.ticket.service.ITicketService;
import rw.ac.auca.tegabus_server.core.users.model.Users;
import rw.ac.auca.tegabus_server.core.users.service.IUsersService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final IBusService busService;
    private final IUsersService usersService;
    private final ITicketService ticketService;
    private final IDestinationService destinationService;

    @GetMapping("/tickets")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

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

    @GetMapping("/ticket/current-month")
    public ResponseEntity<List<Ticket>> getTicketsForCurrentMonth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfMonth = LocalDateTime.now().toLocalDate().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth()).atTime(23, 59, 59, 999999999);

            Date startOfMonthDate = Date.from(startOfMonth.atZone(ZoneId.of("Africa/Kigali")).toInstant());
            Date endOfMonthDate = Date.from(endOfMonth.atZone(ZoneId.of("Africa/Kigali")).toInstant());

            List<Ticket> tickets;
            if (isSuperAdmin) {
                tickets = ticketService.findAllTicketsByDateBetweenAndState(startOfMonthDate, endOfMonthDate, Boolean.TRUE);
            } else {
                tickets = ticketService.findAllTicketsByExpressIdAndDateBetweenAndState(userDetails.getExpressId(), startOfMonthDate, endOfMonthDate, Boolean.TRUE);
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

    @GetMapping("/employee")
    public ResponseEntity<List<Users>> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            List<Users> users;
            if (isSuperAdmin) {
                users = usersService.findAllByState(Boolean.TRUE);
            } else {
                users = usersService.getUsersByExpressId(userDetails.getExpressId());
            }
            return ResponseEntity.ok(users);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}