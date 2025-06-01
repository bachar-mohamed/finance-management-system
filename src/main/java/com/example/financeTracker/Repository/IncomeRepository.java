package com.example.financeTracker.Repository;

import com.example.financeTracker.Entities.Income;
import com.example.financeTracker.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {

    @Query("SELECT u FROM User u " +
            "JOIN FETCH u.incomes i " +
            "JOIN FETCH i.category c " +
            "WHERE u.email = :email")
    Optional<User> findByEmailWithCategoryAndIncome(@Param("email") String email);

    @Query("SELECT u FROM User u " +
            "JOIN FETCH u.incomes i " +
            "JOIN FETCH i.category c " +
            "WHERE u.id = :id " +
            "AND YEAR(i.transactionDate) = :year " +
            "AND MONTH(i.transactionDate) = :month")
    Optional<User> findIncomesByUserAndYearAndMonth(
            @Param("id") int id,
            @Param("year") int year,
            @Param("month") int month);

    @Query("SELECT i FROM Income i " +
            "JOIN FETCH i.category c " +
            "WHERE i.user.id = :userId " +
            "AND i.id = :incomeId")
    Optional<Income> findByUserIdAndIncomeId(@Param("userId") int userId, @Param("incomeId") int incomeId);
}
