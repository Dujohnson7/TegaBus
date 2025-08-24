package rw.ac.auca.tegabus_server.controller.report;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.tegabus_server.core.ticket.model.Ticket;
import rw.ac.auca.tegabus_server.core.ticket.service.ITicketService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final ITicketService ticketService;

    // Get all tickets (role-based)
    @GetMapping("/all")
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
                tickets = ticketService.findAllTicketsByExpressIdAndState(userDetails.getExpressId(),  Boolean.TRUE);
            }

            return ResponseEntity.ok(tickets);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Ticket>> getTicketsByDateRange(
            @RequestParam("start") long startMillis,
            @RequestParam("end") long endMillis
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            Date startDate = new Date(startMillis);
            Date endDate = new Date(endMillis);

            List<Ticket> tickets;
            if (isSuperAdmin) {
                tickets = ticketService.findAllTicketsByDateBetween(startDate, endDate);
            } else {
                tickets = ticketService.findAllTicketsByExpressIdAndDateBetween(
                        userDetails.getExpressId(),
                        startDate,
                        endDate
                );
            }

            return ResponseEntity.ok(tickets);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(@PathVariable String id) {
        try {
            Ticket ticket = ticketService.findTicketByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (ticket != null) {
                return ResponseEntity.ok(ticket);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error fetching ticket: " + ex.getMessage());
        }
    }
}
