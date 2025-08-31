package rw.ac.auca.tegabus_server.controller.clientTicket;

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
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.express.service.IExpressService;
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
@RequestMapping("/api/tegaTicket")
public class ClientTicketController {

    private final ITicketService ticketService;
    private final IScheduleService scheduleService;
    private final IBusService busService;
    private final IDestinationService destinationService;
    private final IExpressService expressService;

    @GetMapping({"/express"})
    public ResponseEntity<List<Express>> getAllExpress(){
        try {
            List<Express> expresses = expressService.findAllExpressByState(Boolean.TRUE);
            return ResponseEntity.ok(expresses);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/express/{id}")
    public ResponseEntity<?> getExpress(@PathVariable String id){
        try {
            Express theExpress = expressService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if(!Objects.isNull(theExpress)){
                return ResponseEntity.ok(theExpress);
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(" Error Express " + ex.getMessage());
        }
    }


    @GetMapping("/expressRoute/{id}")
    public ResponseEntity<?> getDestinationByExpress(@PathVariable String id){
        try {
            List<Destination> theDestination  = destinationService.findAllDestinationsAndExpress_IdAndActive(UUID.fromString(id), Boolean.TRUE);
            if(!Objects.isNull(theDestination)){
                return ResponseEntity.ok(theDestination);
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Destination not found");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(" Error Destination " + ex.getMessage());
        }
    }


    @GetMapping("/ticket")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.findAllByState(Boolean.TRUE);
            return ResponseEntity.ok(tickets);
        }catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bus")
    public ResponseEntity<List<Bus>> getAllBuses() {

        try {
            List<Bus> buses  = busService.findAllByState(Boolean.TRUE);
            return ResponseEntity.ok(buses);
        }catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/scheduleAll")
    public ResponseEntity<List<Schedule>> getAllSchedulesList() {
        try {
            List<Schedule> schedules  = scheduleService.findAllByState(Boolean.TRUE);
            return ResponseEntity.ok(schedules);
        }catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/schedule")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        try {
            List<Schedule> schedules = scheduleService.findAllByCurrentDateAndAvailableSeats();
            return ResponseEntity.ok(schedules);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/destination")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        try {
            List<Destination> destinations = destinationService.findAllByState(Boolean.TRUE);
                return ResponseEntity.ok(destinations);
        }catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerTicket(@RequestBody Ticket theTicket) {
        try {
            if (theTicket != null) {
                Ticket saved = ticketService.registerTicket(theTicket);
                return ResponseEntity.ok(saved);
            } else {
                return ResponseEntity.badRequest().body("Invalid Ticket Data missing");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Ticket Registration: " + ex.getMessage());
        }
    }

}
