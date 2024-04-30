import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserDetails.css';
import { Link ,useNavigate} from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';

function UserDetails() {
  const [busDetails, setBusDetails] = useState([]);
  const token = sessionStorage.getItem('authToken');
  const navigate=useNavigate()

  const role =sessionStorage.getItem('role')

  useEffect(() => {
    const fetchUserDetails = async () => {
      if(!(role && role=='Admin')){
        navigate('/login')
    }
      try {
        const response = await axios.get(
          `https://localhost:7114/api/Users`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setBusDetails(response.data); 
        console.log(busDetails)
      } catch (error) {
        if(error.response && error.response.status === 403){
          window.alert("Unuthorized")
          navigate("/login")
        }
        console.error('Error fetching bus details:', error.message);
      }
    };

    fetchUserDetails(); 
  }, []); 

  const handleDeleteBus=async (userId)=>{
    const confirmed = window.confirm('Are you sure you want to delete this bus?');

    if (!confirmed) {
      return; // If not confirmed, do nothing
    }
    try {
      const sresponse = await axios.delete(
        `https://localhost:7114/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      window.alert('User deleted successfully.');
      window.location.reload();
    } catch (error) {
      if(error.response && error.response.status === 403){
        window.alert("Unuthorized")
        return
      }
      console.error('Error fetching bus details:', error.message);
    }
  }




  return (
    <div><AdminNavbar/>
     <table className="table table-dark">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Contact No</th>
          </tr>
        </thead>
        <tbody>
          {busDetails.map((user) => (
            <tr key={user.userId}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.gender}</td>
              <td>{user.contactNo}</td>
              <td>
                <button
                  type="button" 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteBus(user.userId)}
                >
                  X
                </button>
                <Link to={`/userBookings/${user.userId}`} className="btn btn-link">
    User Bookings
</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDetails;