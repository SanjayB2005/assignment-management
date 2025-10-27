package com.assignmentmanagement.service;

import com.assignmentmanagement.model.User;
import com.assignmentmanagement.model.UserRole;
import com.assignmentmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user;
    }

    public User createUser(String email, String password, String firstName, String lastName, UserRole role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User already exists with email: " + email);
        }

        User user = new User(email, passwordEncoder.encode(password), firstName, lastName, role);
        return userRepository.save(user);
    }

    public User createOAuthUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findUsersByRole(UserRole role) {
        return userRepository.findByRoleAndIsActiveTrue(role);
    }

    public List<User> findAllStudents() {
        return userRepository.findByRoleAndIsActiveTrue(UserRole.STUDENT);
    }

    public List<User> findAllTeachers() {
        return userRepository.findByRoleAndIsActiveTrue(UserRole.TEACHER);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deactivateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(false);
            userRepository.save(user);
        }
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public long getActiveStudentCount() {
        return userRepository.countActiveUsersByRole(UserRole.STUDENT);
    }

    public long getActiveTeacherCount() {
        return userRepository.countActiveUsersByRole(UserRole.TEACHER);
    }

    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContaining(name);
    }
}