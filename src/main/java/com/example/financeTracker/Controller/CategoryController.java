package com.example.financeTracker.Controller;


import com.example.financeTracker.DTO.CategoryDTO;
import com.example.financeTracker.Service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private CategoryService service;

    public CategoryController(CategoryService service){
        this.service=service;
    }


    @GetMapping("/get-categories")
    public ResponseEntity<List<CategoryDTO>> getCategories(){
        List<CategoryDTO> categories =service.getCategories();
        if(categories.isEmpty()){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}
