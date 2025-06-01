package com.example.financeTracker.Controller;

import com.example.financeTracker.DTO.ExpenseDTO;
import com.example.financeTracker.DTO.IncomeDTO;
import com.example.financeTracker.Service.ExpenseService;
import com.example.financeTracker.Service.IncomeService;
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
@RequestMapping("/api/incomes")
public class IncomeController {

    private IncomeService incomeService;


    @Autowired
    public IncomeController(IncomeService service){
        this.incomeService=service;
    }

    @GetMapping("/monthly-income")
    public ResponseEntity<List<IncomeDTO>> monthlyIncomes(@RequestParam int userId, @RequestParam int year, @RequestParam int month){
        List<IncomeDTO> incomes = incomeService.getIncomesByUserEmailInDate(userId,year,month);
        if(incomes.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(incomes, HttpStatus.OK);
    }

    @PostMapping("/add-income")
    public ResponseEntity<IncomeDTO> addIncome(@RequestBody HashMap<String,Object> data){
        String dateString = (String) data.get("transactionDate");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");
        LocalDate localDate = LocalDate.parse(dateString, formatter);
        LocalDateTime transactionDate = localDate.atTime(0, 0);
        Object amountObj = data.get("amount");
        double amount=0;
        if (amountObj instanceof Number) {
            amount = ((Number) amountObj).doubleValue();
        }
        IncomeDTO income = incomeService.addIncome((Integer)data.get("userId"),(String)data.get("description"),(String)data.get("category"),amount,transactionDate);
        if(income==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(income,HttpStatus.OK);
    }

    @PutMapping("/update-income")
    public ResponseEntity<Boolean> updateIncome(@RequestBody HashMap<String,Object> data){
        Object amountObj = data.get("amount");
        double amount=0;
        if (amountObj instanceof Number) {
            amount = ((Number) amountObj).doubleValue();
        }
        boolean state = incomeService.updateIncome((Integer)data.get("userId"),(Integer)data.get("incomeId"),(String)data.get("description"),(String)data.get("category"),amount);
        if(state==false){
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(state,HttpStatus.OK);
    }

    @DeleteMapping("/delete-income")
    public ResponseEntity<Boolean> deleteExpense(@RequestBody HashMap<String,Integer> data){
        boolean state = incomeService.deleteIncome(data.get("userId"),data.get("incomeId"));
        if(state==false){
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(state,HttpStatus.OK);
    }
}
