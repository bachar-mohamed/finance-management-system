package com.example.financeTracker.Repository;

import com.example.financeTracker.Entities.Category;
import com.example.financeTracker.Entities.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface CategoryRepository extends JpaRepository<Category, Integer> {


    @Query("SELECT c FROM Category c " +
            "WHERE c.name = :name")
    Optional<Category> findByName(@Param("name") String name);

    @Query("SELECT c FROM Category c ")
    Optional<List<Category>> getAllCategories();
}
