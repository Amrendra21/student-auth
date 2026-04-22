import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://student-auth-twxg.onrender.com/api';

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [newCourse, setNewCourse] = useState('');
  const [courseMsg, setCourseMsg] = useState('');
  const [courseError, setCourseError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(res.data);
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    try {
      const res = await axios.put(`${API}/update-password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordMsg(res.data.message);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setCourseMsg('');
    setCourseError('');
    try {
      const res = await axios.put(`${API}/update-course`, { course: newCourse }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseMsg(res.data.message);
      setStudent(res.data.student);
      setNewCourse('');
    } catch (err) {
      setCourseError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎓 Student Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">

        <div className="card">
          <h3>👤 My Profile</h3>
          {student && (
            <div className="student-info">
              <p><span>Name:</span> {student.name}</p>
              <p><span>Email:</span> {student.email}</p>
              <p><span>Course:</span> {student.course}</p>
              <p><span>Member Since:</span> {new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>🔒 Update Password</h3>
          {passwordMsg && <div className="alert alert-success">{passwordMsg}</div>}
          {passwordError && <div className="alert alert-error">{passwordError}</div>}
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required />
            </div>
            <button type="submit" className="btn-secondary">Update Password</button>
          </form>
        </div>

        <div className="card">
          <h3>📚 Change Course</h3>
          {courseMsg && <div className="alert alert-success">{courseMsg}</div>}
          {courseError && <div className="alert alert-error">{courseError}</div>}
          <form onSubmit={handleUpdateCourse}>
            <div className="form-group">
              <label>Select New Course</label>
              <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)} required>
                <option value="">Choose a course</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="MBA">MBA</option>
              </select>
            </div>
            <button type="submit" className="btn-secondary">Change Course</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;