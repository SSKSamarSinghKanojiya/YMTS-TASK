import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route exact path="/" component={Login} /> */}
      </Routes>
     </Router>
    </div>
  );
}

export default App;
