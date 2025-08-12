package com.maxxenergywebpage.repository;

import com.maxxenergywebpage.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  boolean existsByEmailIgnoreCase(String email);

  boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

  Optional<User> findByFirstNameIgnoreCaseAndEmailIgnoreCase(String firstName, String email);

  @Query("""
         select u from User u
         where lower(u.firstName) = lower(:firstName)
           and lower(u.email) = lower(:email)
         """)
  Optional<User> findUserCaseInsensitive(
      @Param("firstName") String firstName,
      @Param("email") String email
  );
}
