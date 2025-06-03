package com.example.financeTracker.Controller;

import com.example.financeTracker.DTO.UserDTO;
import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private UserService service;

    public UserController(UserService service){
        this.service = service;
    }

    @GetMapping("/get-info")
    public ResponseEntity<UserDTO> getUserInfo(@RequestParam int userId){
        UserDTO user = service.getUserInformation(userId);
        if(user!=null){
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update-info")
    public ResponseEntity<Boolean> updateBasicInformation(@RequestBody HashMap<String,Object> data){
        boolean status = service.updateUserInfo((Integer)data.get("userId"),(String)data.get("userName"),(String)data.get("email"));
        if(status){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }
        return new ResponseEntity<>(status,HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update-password")
    public ResponseEntity<Boolean> updatePassword(@RequestBody HashMap<String,Object> data){
        boolean status = service.updatePassword((Integer)data.get("userId"),(String)data.get("oldPassword"),(String)data.get("newPassword"));
        if(status){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }
        return new ResponseEntity<>(status,HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Boolean> deleteUser(@RequestBody HashMap<String,Integer> data){
        boolean status = service.deleteUser(data.get("userId"));
        if(status){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }
        return new ResponseEntity<>(status,HttpStatus.NOT_FOUND);
    }
}
