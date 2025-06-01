package com.example.financeTracker.Service;

import com.example.financeTracker.DTO.ExpenseDTO;
import com.example.financeTracker.DTO.IncomeDTO;
import com.example.financeTracker.Entities.Category;
import com.example.financeTracker.Entities.Expense;
import com.example.financeTracker.Entities.Income;
import com.example.financeTracker.Entities.User;
import com.example.financeTracker.Repository.CategoryRepository;
import com.example.financeTracker.Repository.ExpenseRepository;
import com.example.financeTracker.Repository.IncomeRepository;
import com.example.financeTracker.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    private IncomeRepository incomeRepository;
    private UserRepository userRepository;
    private CategoryRepository categoryRepository;

    @Autowired
    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository, CategoryRepository categoryRepository){
        this.incomeRepository=incomeRepository;
        this.userRepository= userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public List<IncomeDTO> getIncomesByUserEmailInDate(int id, int year, int month) {
        Optional<User> userOptional = incomeRepository.findIncomesByUserAndYearAndMonth(id,year,month);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getExpenses().forEach(expense -> System.out.println(expense.getTransactionDate()));
            return user.getIncomes().stream()
                    .map(income -> new IncomeDTO(
                            income.getId(),
                            income.getDescription(),
                            income.getAmount(),
                            income.getTransactionDate(),
                            income.getUpdatedAt(),
                            income.getCategory().getName(),
                            income.getCategory().getCategoryImage()))
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException();
        }
    }

    @Transactional
    public IncomeDTO addIncome(int userId, String expenseDescription,String expenseCategory, Double expenseAmount, LocalDateTime expenseDate){
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return null;
        }
        Category category = categoryRepository.findByName(expenseCategory).get();
        Income income = new Income(userOptional.get(), category, expenseAmount, expenseDescription, expenseDate);
        incomeRepository.save(income);
        return new IncomeDTO(income.getId(),income.getDescription(),income.getAmount(),income.getTransactionDate(),income.getUpdatedAt(),income.getCategory().getName(),income.getCategory().getCategoryImage());
    }

    @Transactional
    public boolean updateIncome(int userId,int expenseId, String expenseDescription,String expenseCategory, Double expenseAmount){
        Optional<Income> userIncome = incomeRepository.findByUserIdAndIncomeId(userId,expenseId);
        if (userIncome.isEmpty()) {
            return false;
        }
        Income income = userIncome.get();
        Category category = categoryRepository.findByName(expenseCategory).get();
        income.setDescription(expenseDescription);
        income.setAmount(expenseAmount);
        income.setUpdatedAt(LocalDateTime.now());
        income.setCategory(category);
        incomeRepository.save(income);
        return true;
    }

    @Transactional
    public boolean deleteIncome(int userId,int expenseId){
        Optional<Income> userIncome = incomeRepository.findByUserIdAndIncomeId(userId,expenseId);
        if (userIncome.isEmpty()) {
            return false;
        }
        Income income = userIncome.get();
        incomeRepository.delete(income);
        return true;
    }

}
