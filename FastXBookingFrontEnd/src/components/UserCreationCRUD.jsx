import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserCreationCRUD() {
  const [todoTask, setTodoTask] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newContact, setNewContact] = useState('');
  const token = sessionStorage.getItem('authToken')

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('https://localhost:7114/api/Users',{
        headers: {
          Authorization: `Bearer ${token}`
        }
    }
    );
      setTodoTask(response.data);
    } catch (error) {
      console.error('Error while fetching UserDetails:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('https://localhost:7114/api/Users', {
        name: newName,
        email: newEmail,
        gender: newGender,
        address: newAddress,
        password: newPassword,
        contactNo : newContact
      });
      setTodoTask([...todoTask, response.data]);
      setNewName('');
      setNewEmail('');
      setNewGender('');
      setNewAddress('');
      setNewPassword('');
      setNewContact('');
    } catch (error) {
      console.error('Error while adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`https://localhost:7114/api/Users/${id}`,{
        headers: {
          Authorization: `Bearer ${token}}`
        }
    }
    );
      fetchAllUsers();
    } catch (error) {
      console.error('Error while deleting user:', error);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <input
        type="text"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        placeholder="Enter name"
      />
      <input
        type="text"
        value={newEmail}
        onChange={(event) => setNewEmail(event.target.value)}
        placeholder="Enter email"
      />
      <input
        type="text"
        value={newGender}
        onChange={(event) => setNewGender(event.target.value)}
        placeholder="Enter gender"
      />
      <input
        type="text"
        value={newAddress}
        onChange={(event) => setNewAddress(event.target.value)}
        placeholder="Enter address"
      />
      <input
        type="text"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        placeholder="Enter Password"
      />
      <input
        type="text"
        value={newContact}
        onChange={(event) => setNewContact(event.target.value)}
        placeholder="Enter ContactNo"
      />
      <button className="btn btn-success" onClick={handleCreateUser}>
        Add User
      </button>
      <table className="table table-dark">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todoTask.map((todo) => (
            <tr key={todo.userId}>
              <td>{todo.userId}</td>
              <td>{todo.name}</td>
              <td>{todo.email}</td>
              <td>{todo.gender}</td>
              <td>{todo.address}</td>
              <td>
                <button
                  type="button" 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteUser(todo.userId)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
