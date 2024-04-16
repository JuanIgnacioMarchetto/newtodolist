import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
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
        alarmTime: alarmTime ? new Date(alarmTime) : null 
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      setDueDate(new Date());
      setAlarmTime(null);
      alert('Tarea agregada exitosamente');
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const isTaskOverdue = (dueDate) => {
    const now = new Date();
    return dueDate < now;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task, index) => {
        if (isTaskOverdue(task.dueDate)) {
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
                {isTaskOverdue(task.dueDate) && <span style={{ color: 'red' }}> - Vencida</span>}
                <button onClick={() => handleDeleteTask(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
