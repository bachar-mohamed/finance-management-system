package com.example.financeTracker.Service;

import com.example.financeTracker.DTO.CategoryDTO;
import com.example.financeTracker.DTO.ExpenseDTO;
import com.example.financeTracker.Entities.Category;
import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private CategoryRepository repository;

    @Autowired
    public CategoryService(CategoryRepository repository){
        this.repository=repository;
    }


    public List<CategoryDTO> getCategories(){
        Optional<List<Category>> categoriesOptional = repository.getAllCategories();
        if(categoriesOptional.isEmpty()){
            return null;
        }
        else{
            List<Category> categories = categoriesOptional.get();
            return categories.stream()
                    .map(category -> new CategoryDTO(
                            category.getId(),
                            category.getName(),
                            category.getType().name(),
                            category.getCategoryImage()))
                    .collect(Collectors.toList());
        }
    }

}
