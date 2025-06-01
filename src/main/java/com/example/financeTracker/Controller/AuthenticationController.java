package com.example.financeTracker.Controller;

import com.example.financeTracker.Auth.AuthenticationRequest;
import com.example.financeTracker.Auth.AuthenticationResponse;
import com.example.financeTracker.Auth.AuthenticationService;
import com.example.financeTracker.Auth.RegisterRequest;
import com.example.financeTracker.Service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final ExpenseService expenseService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
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
