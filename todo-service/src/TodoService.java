package com.todo.service;
import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;

    public Todo create(Todo todo) { return todoRepository.save(todo); }
    public List<Todo> getAll()    { return todoRepository.findAll(); }
    public Optional<Todo> getById(Long id) { return todoRepository.findById(id); }
    public List<Todo> getByUser(Long userId) { return todoRepository.findByUserId(userId); }

    public Todo update(Long id, Todo updated) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found: " + id));
        todo.setTitle(updated.getTitle());
        todo.setDescription(updated.getDescription());
        todo.setPriority(updated.getPriority());
        return todoRepository.save(todo);
    }

    public Todo toggleComplete(Long id) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found: " + id));
        todo.setCompleted(!todo.isCompleted());
        return todoRepository.save(todo);
    }

    public void delete(Long id) { todoRepository.deleteById(id); }

    public Map<String, Object> getStats() {
        long total     = todoRepository.count();
        long completed = todoRepository.countByCompleted(true);
        long pending   = todoRepository.countByCompleted(false);
        Map<String, Object> stats = new HashMap<>();
        stats.put("total",     total);
        stats.put("completed", completed);
        stats.put("pending",   pending);
        return stats;
    }
}
