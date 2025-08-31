package rw.ac.auca.tegabus_server.controller.destination;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.tegabus_server.core.destination.model.Destination;
import rw.ac.auca.tegabus_server.core.destination.service.IDestinationService;
import rw.ac.auca.tegabus_server.core.users.service.UserDetailsImpl;
import rw.ac.auca.tegabus_server.core.util.district.EDistrictState;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/destinations")
public class DestinationController {

    private final IDestinationService destinationService;

    @GetMapping("/all")
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


    @GetMapping("/districts")
    public ResponseEntity<List<EDistrictState>> getAllDistricts() {
        List<EDistrictState> districts = Arrays.asList(EDistrictState.values());
        return ResponseEntity.ok(districts);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerDestination(@RequestBody Destination theDestination){
        try {
            if (theDestination != null && theDestination.getExpress() != null) {
                Destination saved = destinationService.registerDestination(theDestination);
                return ResponseEntity.ok(saved);
            } else {
                return ResponseEntity.badRequest().body("Invalid Destination Data or Express missing");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Destination Registration: " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDestination(@RequestBody Destination theDestination, @PathVariable String id) {
        try {
            Destination existDestination = destinationService.findDestinationByIdAndActive(UUID.fromString(id), Boolean.TRUE);
            if(!Objects.isNull(existDestination)){
                theDestination.setId(UUID.fromString(id));
                Destination editDestination = destinationService.updateDestination(theDestination);
                return ResponseEntity.ok(editDestination);
            } else {
                return ResponseEntity.badRequest().body("Invalid Destination ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Destination Update " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable String id) {
        try {
            if(!Objects.isNull(id)){
                Destination theDestination = new Destination();
                theDestination.setId(UUID.fromString(id));
                destinationService.deleteDestination(theDestination);
                return ResponseEntity.ok("Destination Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Destination ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Destination Delete " + ex.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getDestination(@PathVariable String id){
        try {
            Destination theDestination = destinationService.findDestinationByIdAndActive(UUID.fromString(id), Boolean.TRUE);
            if(!Objects.isNull(theDestination)){
                return ResponseEntity.ok(theDestination);
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Destination not found");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(" Error Destination " + ex.getMessage());
        }
    }


}
