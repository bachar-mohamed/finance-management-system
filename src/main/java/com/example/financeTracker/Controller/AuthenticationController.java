package com.example.financeTracker.Controller;

import com.example.financeTracker.Auth.AuthenticationRequest;
import com.example.financeTracker.Auth.AuthenticationResponse;
import com.example.financeTracker.Auth.AuthenticationService;
import com.example.financeTracker.Auth.RegisterRequest;
import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Repository.UserRepository;
import com.example.financeTracker.Service.ExpenseService;
import com.example.financeTracker.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        Optional<User> user = repository.findByEmail(request.getEmail());
        if(user.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AuthenticationResponse(null,"email already used",-1));
        }
        try {
            return ResponseEntity.ok(service.register(request));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthenticationResponse(null,"an error occurred, please try again",-1));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse response;
        try {
            response = service.authenticate(request);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AuthenticationResponse(null,"invalid email or password",-1));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthenticationResponse(null,"an error occurred, please try again",-1));
        }

        return ResponseEntity.ok(response);
    }

}
