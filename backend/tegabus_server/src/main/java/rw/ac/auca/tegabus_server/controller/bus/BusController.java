package rw.ac.auca.tegabus_server.controller.bus;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.tegabus_server.core.bus.model.Bus;
import rw.ac.auca.tegabus_server.core.bus.service.IBusService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/buses")
public class BusController {

    private final IBusService busService;

    @GetMapping("/all")
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

    @PostMapping("/register")
    public ResponseEntity<?> registerBus(@RequestBody Bus theBus) {
        try {
            if (theBus != null && theBus.getExpress() != null) {
                Bus saved = busService.registerBus(theBus);
                return ResponseEntity.ok(saved);
            } else {
                return ResponseEntity.badRequest().body("Invalid Bus Data or Express missing");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Bus Registration: " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBus(@RequestBody Bus theBus, @PathVariable String id) {
        try {
            Bus existBus = busService.findBusByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existBus)) {
                theBus.setId(UUID.fromString(id));
                Bus updatedBus = busService.updateBus(theBus);
                return ResponseEntity.ok(updatedBus);
            } else {
                return ResponseEntity.badRequest().body("Invalid Bus ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Bus Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBus(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Bus theBus = new Bus();
                theBus.setId(UUID.fromString(id));
                busService.deleteBus(theBus);
                return ResponseEntity.ok("Bus Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Bus ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Bus Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBus(@PathVariable String id) {
        try {
            Bus theBus = busService.findBusByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theBus)) {
                return ResponseEntity.ok(theBus);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bus not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Bus: " + ex.getMessage());
        }
    }
}
