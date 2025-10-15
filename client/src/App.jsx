import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Admin from "./Admin.jsx";
import Employee from "./Employee.jsx";
import IssueCertificate from './IssueCertificate.jsx';
import AddStudent from './AddStudent.jsx';
import ViewStudents from './ViewStudent.jsx';
import Student from './Student.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/student" element={<Student />}/>
        
        <Route path="/admin" element={<Admin />}>
        <Route index element={<IssueCertificate />} /> 
        <Route path="issue-certificate" element={<IssueCertificate />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="view-students" element={<ViewStudents />} />
      </Route>
      </Routes>
    </Router>
  );
}

export default App;