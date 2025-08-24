package rw.ac.auca.tegabus_server.controller.express;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import rw.ac.auca.tegabus_server.core.express.model.Express;
import rw.ac.auca.tegabus_server.core.express.service.IExpressService;

import java.io.File;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/express")
public class ExpressController {

    private final IExpressService  expressService;

    @GetMapping({"/all"})
    public ResponseEntity<List<Express>> getAllExpress(){
        try {
            List<Express> expresses = expressService.findAllExpressByState(Boolean.TRUE);
            return ResponseEntity.ok(expresses);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    /*@PostMapping("/register")
    public ResponseEntity<?> registerExpress(@RequestBody Express theExpress){
        try {
            if (!Objects.isNull(theExpress)){
                Express saveExpress = expressService.registerExpress(theExpress);
                return ResponseEntity.ok(saveExpress);
            }else {
                return ResponseEntity.badRequest().body("Invalid Express Data");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(" Error Express Registration " + ex.getMessage());
        }
    }*/


    @PostMapping("/register")
    public ResponseEntity<?> registerExpress(
            @RequestParam("expressName") String expressName,
            @RequestParam("expressDescription") String expressDescription,
            @RequestParam("expressLogo") MultipartFile expressLogo,
            @RequestParam("expressProfile") MultipartFile expressProfile
    ) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String logoFileName = UUID.randomUUID() + "_" + expressLogo.getOriginalFilename();
            String profileFileName = UUID.randomUUID() + "_" + expressProfile.getOriginalFilename();

            String logoPath = uploadDir + logoFileName;
            String profilePath = uploadDir + profileFileName;

            expressLogo.transferTo(new File(logoPath));
            expressProfile.transferTo(new File(profilePath));

            Express express = new Express();
            express.setExpressName(expressName);
            express.setExpressDescription(expressDescription);
            express.setExpressLogo(logoFileName);
            express.setExpressProfile(profileFileName);

            Express savedExpress = expressService.registerExpress(express);

            return ResponseEntity.ok(savedExpress);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving express: " + ex.getMessage());
        }
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateExpress(
            @PathVariable String id,
            @RequestParam("expressName") String expressName,
            @RequestParam("expressDescription") String expressDescription,
            @RequestParam(value = "expressLogo", required = false) MultipartFile expressLogo,
            @RequestParam(value = "expressProfile", required = false) MultipartFile expressProfile
    ) {
        try {
            Express existExpress = expressService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);

            existExpress.setExpressName(expressName);
            existExpress.setExpressDescription(expressDescription);

            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            if (expressLogo != null) {
                String logoFileName = UUID.randomUUID() + "_" + expressLogo.getOriginalFilename();
                expressLogo.transferTo(new File(uploadDir + logoFileName));
                existExpress.setExpressLogo(logoFileName);
            }

            if (expressProfile != null) {
                String profileFileName = UUID.randomUUID() + "_" + expressProfile.getOriginalFilename();
                expressProfile.transferTo(new File(uploadDir + profileFileName));
                existExpress.setExpressProfile(profileFileName);
            }

            Express updatedExpress = expressService.updateExpress(existExpress);
            return ResponseEntity.ok(updatedExpress);

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error updating express: " + ex.getMessage());
        }
    }





    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpress(@PathVariable String id) {
        try {
            Express theExpress = new Express();
            theExpress.setId(UUID.fromString(id));
            Express deleted = expressService.deleteExpress(theExpress);
            return ResponseEntity.ok("Express Deleted Successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID format: " + id);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error deleting express: " + ex.getMessage());
        }
    }



    @GetMapping("/{id}")
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

}
