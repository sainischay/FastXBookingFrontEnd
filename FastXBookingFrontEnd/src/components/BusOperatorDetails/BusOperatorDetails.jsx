import { useEffect, useState } from 'react';
import axios from 'axios';
import './BusOperatorDetails.css';
import { Link ,useNavigate} from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';

function BusOperatorDetails() {
  const [busDetails, setBusDetails] = useState([]);
  const token = sessionStorage.getItem('authToken');
  const navigate=useNavigate()
  const role = sessionStorage.getItem('role')
  

  useEffect(() => {
    const fetchBusDetails = async () => {
      if(!(token && role=='Admin')){
        navigate('/login')
    }
      try {
        const response = await axios.get(
          `https://localhost:7114/api/BusOperator`,
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

    fetchBusDetails(); 
  }, []); 

  const handleBusOperatorDelete=async (busOperatorId)=>{
    const confirmed = window.confirm('Are you sure you want to delete the operator?');

    if (!confirmed) {
      return; // If not confirmed, do nothing
    }
    try {
      const sresponse = await axios.delete(
        `https://localhost:7114/api/BusOperator/${busOperatorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      window.alert('Bus Operator deleted successfully.');
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
            <th>Bus Operator Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Contact No</th>
          </tr>
        </thead>
        <tbody>
          {busDetails.map((busOperator) => (
            <tr key={busOperator.userId}>
              <td>{busOperator.name}</td>
              <td>{busOperator.email}</td>
              <td>{busOperator.address}</td>
              <td>{busOperator.gender}</td>
              <td>{busOperator.contactNo}</td>
              <td>
                <button
                  type="button" 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleBusOperatorDelete(busOperator.userId)}
                >
                  X
                </button>
                <Link to={`/busDetails/${busOperator.userId}`} className="btn btn-link">
    Bus Details
</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusOperatorDetails;