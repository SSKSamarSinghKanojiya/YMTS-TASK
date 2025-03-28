import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [expectedTime, setExpectedTime] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const history = useNavigate();

    //fetch tasks from the server
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    history.push('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setTasks(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTasks();
    }
    , [history]);

    //handle task submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            // If editing, update the task
            if(editingTask){
                const updatedTask = { taskName, description, expectedTime, status: 'pending' };
                const response = await axios.put(`http://localhost:5000/api/tasks/update/${editingTask._id}`, updatedTask, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTasks(tasks.map(task => task._id === editingTask._id? response.data : task));
                setEditingTask(null);
            }else{
                // Create a new task
                const newTask = { taskName, description, expectedTime };
                const response = await axios.post('http://localhost:5000/api/tasks/add', newTask, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTasks([...tasks, response.data]);
            }

            //refresh the tasks list
            setTaskName('');
            setDescription('');
            setExpectedTime('');
        
            
        } catch (error) {
            console.error(error);
        }
    }

    // handle marking a task as completed
    const handleComplete = async (task) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            await axios.put(`http://localhost:5000/api/tasks/update/${task._id}`, { status: 'completed' }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTasks(tasks.map(t => t._id === task._id ? { ...t, status: 'completed' } : t));
        } catch (error) {
            console.error(error);
        }
    }

    //handle task deletion
    const handleDelete = async (task) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            await axios.delete(`http://localhost:5000/api/tasks/delete/${task._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTasks(tasks.filter(t => t._id!== task._id));
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div>
            <h1>TODO LIST APP</h1>
            <h3>Total Tasks : { tasks.length }</h3>
            
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input type="text" placeholder="Expected Time" value={expectedTime} onChange={(e) => setExpectedTime(e.target.value)}/>
                <button type="submit">{editingTask? 'Update Task' : 'Add Task'}</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <strong>{task.taskName}</strong> - {task.status}
                        <p>{task.description}</p>
                        <p>Expected Time: {task.expectedTime} minutes</p>
                        {task.status === 'pending' ? (
                            <button onClick={() => handleComplete(task)}>Mark as Completed</button>
                        ):(
                            <p>Completed in {task.actualTime} minutes</p>
                        )}
                        <button onClick={() => handleDelete(task)}>Delete</button>
                        <button onClick={() => {setEditingTask(task); setTaskName(task.taskName); setDescription(task.description); setExpectedTime(task.expectedTime);}}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;