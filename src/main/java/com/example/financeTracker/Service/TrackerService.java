package com.example.financeTracker.Service;

import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class TrackerService implements IService {
    private BCryptPasswordEncoder encoder;
    private final UserRepository repository;

    @Autowired
    public TrackerService(UserRepository repository){
        this.repository=repository;
        this.encoder = new BCryptPasswordEncoder();
    }


    @Override
    @Transactional
    public void addUser(User user) {
        System.out.print("user password is: ");
        System.out.println(user);
        String hashedPassword = encoder.encode(user.getPasswordHash());
        user.setPasswordHash(hashedPassword);
        repository.save(user);
    }
}
