package com.example.financeTracker.Repository;

import com.example.financeTracker.Entities.Expense;
import com.example.financeTracker.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {


    @Query("SELECT u FROM User u " +
            "JOIN FETCH u.expenses e " +
            "JOIN FETCH e.category c " +
            "WHERE u.email = :email")
    Optional<User> findByEmailWithCategoryAndExpenses(@Param("email") String email);

    @Query("SELECT u FROM User u " +
            "JOIN FETCH u.expenses e " +
            "JOIN FETCH e.category c " +
            "WHERE u.id = :id " +
            "AND YEAR(e.transactionDate) = :year " +
            "AND MONTH(e.transactionDate) = :month")
    Optional<User> findExpensesByUserAndYearAndMonth(
            @Param("id") int id,
            @Param("year") int year,
            @Param("month") int month);

    @Query("SELECT e FROM Expense e " +
            "JOIN FETCH e.category c " +
            "WHERE e.user.id = :userId " +
            "AND e.id = :expenseId")
    Optional<Expense> findByUserIdAndExpenseId(@Param("userId") int userId, @Param("expenseId") int expenseId);
/*
    @Query("SELECT SUM(e.amount) " +
            "FROM Expense e " +
            "JOIN e.user u " +
            "WHERE u.email = :email " +
            "AND YEAR(e.transactionDate) = :year " +
            "AND MONTH(e.transactionDate) = :month")
    Double sumExpensesByUserAndYearAndMonth(
            @Param("email") String email,
            @Param("year") int year,
            @Param("month") int month);

    @Query("SELECT SUM(e.amount) AS total, c.name " +
            "FROM Expense e " +
            "JOIN e.user u " +
            "JOIN e.category c " +
            "WHERE u.id = :userId " +
            "AND YEAR(e.transactionDate) = :year " +
            "AND MONTH(e.transactionDate) = :month " +
            "GROUP BY c.name " +
            "ORDER BY total DESC")
    List<Object[]> sumExpensesByCategoryForUserAndYearAndMonth(
            @Param("userId") int id,
            @Param("year") int year,
            @Param("month") int month);*/
}


