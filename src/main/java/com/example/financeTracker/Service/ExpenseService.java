package com.example.financeTracker.Service;

import com.example.financeTracker.DTO.ExpenseDTO;
import com.example.financeTracker.Entities.Category;
import com.example.financeTracker.Entities.Expense;
import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Repository.CategoryRepository;
import com.example.financeTracker.Repository.ExpenseRepository;
import com.example.financeTracker.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExpenseService {


    private ExpenseRepository expenseRepository;
    private UserRepository userRepository;
    private CategoryRepository categoryRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository,UserRepository userRepository,CategoryRepository categoryRepository){
        this.expenseRepository=expenseRepository;
        this.userRepository= userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public List<ExpenseDTO> getExpensesByUserEmailInDate(int id,int year,int month) {
        Optional<User> userOptional = expenseRepository.findExpensesByUserAndYearAndMonth(id,year,month);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getExpenses().forEach(expense -> System.out.println(expense.getTransactionDate()));
            return user.getExpenses().stream()
                    .map(expense -> new ExpenseDTO(
                            expense.getId(),
                            expense.getDescription(),
                            expense.getAmount(),
                            expense.getTransactionDate(),
                            expense.getUpdatedAt(),
                            expense.getCategory().getName(),
                            expense.getCategory().getCategoryImage()))
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException();
        }
    }

    @Transactional
    public ExpenseDTO addExpense(int userId, String expenseDescription,String expenseCategory, Double expenseAmount, LocalDateTime expenseDate){
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return null;
            }
            Category category = categoryRepository.findByName(expenseCategory).get();
            Expense expense = new Expense(userOptional.get(), category, expenseAmount, expenseDescription, expenseDate);
            expenseRepository.save(expense);
            return new ExpenseDTO(expense.getId(),expense.getDescription(),expense.getAmount(),expense.getTransactionDate(),expense.getUpdatedAt(),expense.getCategory().getName(),expense.getCategory().getCategoryImage());
    }

    @Transactional
    public boolean updateExpense(int userId,int expenseId, String expenseDescription,String expenseCategory, Double expenseAmount){
        Optional<Expense> userExpense = expenseRepository.findByUserIdAndExpenseId(userId,expenseId);
        if (userExpense.isEmpty()) {
            return false;
        }
        Expense expense = userExpense.get();
        Category category = categoryRepository.findByName(expenseCategory).get();
        expense.setDescription(expenseDescription);
        expense.setAmount(expenseAmount);
        expense.setUpdatedAt(LocalDateTime.now());
        expense.setCategory(category);
        expenseRepository.save(expense);
        return true;
    }

    @Transactional
    public boolean deleteExpense(int userId,int expenseId){
        Optional<Expense> userExpense = expenseRepository.findByUserIdAndExpenseId(userId,expenseId);
        if (userExpense.isEmpty()) {
            return false;
        }
        Expense expense = userExpense.get();
        expenseRepository.delete(expense);
        return true;
    }

}
