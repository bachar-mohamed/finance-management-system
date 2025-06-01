package com.example.financeTracker.Controller;


import com.example.financeTracker.DTO.ExpenseDTO;
import com.example.financeTracker.Entities.Expense;
import com.example.financeTracker.Service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private ExpenseService expenseService;


    @Autowired
    public ExpenseController(ExpenseService service){
        this.expenseService=service;
    }

    @GetMapping("/monthly-expenses")
    public ResponseEntity<List<ExpenseDTO>> monthlyExpenses(@RequestParam int userId, @RequestParam int year, @RequestParam int month){
        List<ExpenseDTO> expenses = expenseService.getExpensesByUserEmailInDate(userId,year,month);
        if(expenses.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    @PostMapping("/add-expense")
    public ResponseEntity<ExpenseDTO> addExpense(@RequestBody HashMap<String,Object> data){
        String dateString = (String) data.get("transactionDate");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");
        LocalDate localDate = LocalDate.parse(dateString, formatter);
        LocalDateTime transactionDate = localDate.atTime(0, 0);
        Object amountObj = data.get("amount");
        double amount=0;
        if (amountObj instanceof Number) {
        amount = ((Number) amountObj).doubleValue();
        }
        ExpenseDTO expense = expenseService.addExpense((Integer)data.get("userId"),(String)data.get("description"),(String)data.get("category"),amount,transactionDate);
        if(expense==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(expense,HttpStatus.OK);
    }

    @PutMapping("/update-expense")
    public ResponseEntity<Boolean> updateExpense(@RequestBody HashMap<String,Object> data){
        Object amountObj = data.get("amount");
        double amount=0;
        if (amountObj instanceof Number) {
            amount = ((Number) amountObj).doubleValue();
        }
        boolean state = expenseService.updateExpense((Integer)data.get("userId"),(Integer)data.get("expenseId"),(String)data.get("description"),(String)data.get("category"),amount);
        if(state==false){
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(state,HttpStatus.OK);
    }

    @DeleteMapping("/delete-expense")
    public ResponseEntity<Boolean> deleteExpense(@RequestBody HashMap<String,Integer> data){
        boolean state = expenseService.deleteExpense(data.get("userId"),data.get("expenseId"));
        if(state==false){
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(state,HttpStatus.OK);
    }

}
