import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {email, password});
            localStorage.setItem('token', res.data.token);
            console.log(res.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    }
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={ handleSubmit }>
            <input type="email" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit">Login</button>
            </form>
        </div>
    )
    
}

export default Login;