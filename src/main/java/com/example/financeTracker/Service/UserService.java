package com.example.financeTracker.Service;

import com.example.financeTracker.DTO.UserDTO;
import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository repository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository repository,PasswordEncoder encoder){
        this.repository = repository;
        this.passwordEncoder=encoder;
    }


    public UserDTO getUserInformation(int userId){
        Optional<User> userOptional = repository.findById(userId);
        if(userOptional!=null){
            User user = userOptional.get();
            return new UserDTO(user.getUserName(),user.getEmail());
        }
        return null;
    }

    public boolean updateUserInfo(int userId,String userName,String email){
        Optional<User> userOptional = repository.findById(userId);
        if(userOptional==null){
            return false;
        }
        User user = userOptional.get();
        user.setUserName(userName);
        user.setEmail(email);
        repository.save(user);
        return true;
    }

    public boolean updatePassword(int userId,String oldPassword,String newPassword){
        Optional<User> userOptional = repository.findById(userId);
        if(userOptional==null){
            return false;
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            return false;
        }
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPasswordHash(encodedNewPassword);
        repository.save(user);
        return true;
    }

    public boolean deleteUser(int userId){
        Optional<User> userOptional = repository.findById(userId);
        if(userOptional==null){
            return false;
        }
        User user = userOptional.get();
        repository.delete(user);
        return true;
    }
}
