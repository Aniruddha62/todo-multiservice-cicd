package com.todo.repository;
import com.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
    List<Todo> findByCompleted(boolean completed);
    List<Todo> findByPriority(Todo.Priority priority);
    long countByCompleted(boolean completed);
}
