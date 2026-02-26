package com.todo;
import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import com.todo.service.TodoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {
    @Mock TodoRepository todoRepository;
    @InjectMocks TodoService todoService;

    @Test void shouldCreateTodo() {
        Todo t = Todo.builder().title("Test task").build();
        when(todoRepository.save(t)).thenReturn(t);
        assertEquals("Test task", todoService.create(t).getTitle());
    }

    @Test void shouldReturnTodoById() {
        Todo t = Todo.builder().id(1L).title("Read book").build();
        when(todoRepository.findById(1L)).thenReturn(Optional.of(t));
        assertTrue(todoService.getById(1L).isPresent());
    }

    @Test void shouldToggleComplete() {
        Todo t = Todo.builder().id(1L).title("Task").completed(false).build();
        when(todoRepository.findById(1L)).thenReturn(Optional.of(t));
        when(todoRepository.save(any())).thenReturn(t);
        Todo result = todoService.toggleComplete(1L);
        verify(todoRepository).save(t);
        assertNotNull(result);
    }

    @Test void shouldDeleteTodo() {
        todoService.delete(1L);
        verify(todoRepository).deleteById(1L);
    }
}
