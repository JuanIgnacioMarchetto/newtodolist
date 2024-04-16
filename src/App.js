
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        task: inputValue,
        dueDate: dueDate,
        alarmTime: alarmTime ? new Date(alarmTime) : null,
        completed: false // Nuevo campo para marcar si la tarea está completada
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      setDueDate(new Date());
      setAlarmTime(null);
      localStorage.setItem('tasks', JSON.stringify([...tasks, newTask])); // Guardar en local storage
      alert('Tarea agregada exitosamente');
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks)); // Guardar en local storage
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Guardar en local storage
  };

  const isTaskOverdue = (dueDate) => {
    const now = new Date();
    return dueDate < now;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task, index) => {
        if (isTaskOverdue(task.dueDate) && !task.completed) {
          alert(`La tarea "${task.task}" está vencida`);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Lista de Tareas</h1>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Escribe una tarea..."
          />
          <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} showTimeSelect />
          <input
            type="time"
            value={alarmTime || ''}
            onChange={(event) => setAlarmTime(event.target.value)}
          />
          <button onClick={handleAddTask}>Agregar</button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                {task.task} - {task.dueDate.toString()}
                {isTaskOverdue(task.dueDate) && !task.completed && (
                  <span style={{ color: 'red' }}> - Vencida</span>
                )}
                {task.completed && <span style={{ color: 'green' }}> - Cumplida</span>}
                {!task.completed && (
                  <button onClick={() => handleTaskCompletion(index)}>Confirmar Cumplida</button>
                )}
                <button onClick={() => handleDeleteTask(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}export default App
