import React, { useState, useEffect } from 'react'; 
import DatePicker from 'react-datepicker'; // componente de DatePicker
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'; 
import { format } from 'date-fns'; //  para formatear fechas

function App() {
  // estado inicial de tareas
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  
  const [inputValue, setInputValue] = useState(''); // estado para el valor de input de tarea
  const [dueDate, setDueDate] = useState(new Date()); // estado para vemcimiento
  const [alarmTime, setAlarmTime] = useState(null); // estado alarma

  //cambio de valor de input de la tarea
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  //nueva tarea
  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        task: inputValue,
        dueDate: dueDate,
        alarmTime: alarmTime ? new Date(`${format(dueDate, 'yyyy-MM-dd')}T${alarmTime}`) : null,
        completed: false //marca tarea cumplida
      };
      const updatedTasks = [...tasks, newTask]; // agrega la nueva tarea a la lista 
      setTasks(updatedTasks); // actualiza el estado de las tareas
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // guarda en localStorage
      setInputValue('');
      setDueDate(new Date());
      setAlarmTime(null); 
      alert('Tarea agregada exitosamente');
    }
  };

  // elimina tareass
  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1); 
    setTasks(newTasks); 
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

//reìte proceso de confirmacione detarea cumplida
  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks); 
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };

  //chequea si una tarea esta vencida
  const isTaskOverdue = (dueDate) => {
    const now = new Date();
    return new Date(dueDate) < now;
  };

  // cada 60 seg verifica vencimiento de tareas
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
        <div className="container">
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
            onChange={(event) => setAlarmTime(event.target.value)} // input  tiempo de alarma
          />
          <button className="button" onClick={handleAddTask}>Agregar</button> 
            {tasks.map((task, index) => (
              <li key={index}>
                {task.task} - {format(new Date(task.dueDate), 'PPpp')}
                {isTaskOverdue(task.dueDate) && !task.completed && (
                  <span style={{ color: 'red' }}> - Vencida</span> //muestra si la tarea esta vencida
                )}
                {task.completed && <span style={{ color: 'green' }}> - Cumplida</span>} // mustra si la tarea esta cumplida
                {!task.completed && (
                  <button className="button" onClick={() => handleTaskCompletion(index)}>Confirmar Cumplida</button> // boton tarea cumplida
                )}
                <button className="button" onClick={() => handleDeleteTask(index)}>Eliminar</button> // boton  eliminar tarea
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
