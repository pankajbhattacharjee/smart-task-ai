// API function to delete a task
export const deleteTask = async (taskId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

// API function to update a task
export const updateTask = async (taskId, updates) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};
// API function to fetch tasks
export const getTasks = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};
// Test login directly
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123'
  })
})
.then(res => {
  console.log('Login status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Login response:', data);
  if (data.token) {
    console.log('✅ Login successful! Token:', data.token.substring(0, 20) + '...');
  }
})
.catch(err => console.error('Fetch error:', err));

