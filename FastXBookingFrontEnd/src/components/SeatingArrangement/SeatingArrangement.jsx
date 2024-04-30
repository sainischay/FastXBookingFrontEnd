import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './SeatingArrangement.css';
import Navbar from '../Navbar/Navbar';
import wallpaper1 from '../../assets/wallpaper1.jpg'

const SeatingArrangement = () => {
  const [seats, setSeats] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({});
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedBoardingPointId, setSelectedBoardingPointId] = useState('');
  const [selectedDroppingPointId, setSelectedDroppingPointId] = useState('');
  const { busId } = useParams();
  const token = sessionStorage.getItem('authToken');
  const navigate = useNavigate();
  const busFare = parseFloat(sessionStorage.getItem('busFare'));
  //const role = sessionStorage.getItem('/login')
  const role = sessionStorage.getItem('role')
  

  // Redirect to the payment page when seats are selected
  const redirectToPayment = () => {
    // Validate required fields
    if (!selectedBoardingPointId || !selectedDroppingPointId) {
      alert('Please select both Boarding Point and Dropping Point.');
      return;
    }

    for (const seatNo of selectedSeats) {
      const details = passengerDetails[seatNo];
      if (!details || !details.name || !details.gender || !details.age) {
        alert(`Please provide all details for Seat ${seatNo}.`);
        return;
      }
    }

    // Store selected seats, passenger details, and selected points in session storage
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    sessionStorage.setItem('passengerDetails', JSON.stringify(passengerDetails));
    sessionStorage.setItem('selectedBoardingPointId', selectedBoardingPointId);
    sessionStorage.setItem('selectedDroppingPointId', selectedDroppingPointId);
  
    // Redirect to the payment page
    navigate('/payment');
  };
  
  useEffect(() => {

    const fetchData = async () => {
      try {
        if(!(token && role=='User')){
          navigate('/login')
      }

        const response = await axios.get(`https://localhost:7114/api/BusSeats/${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSeats(response.data);

        const bpresponse = await axios.get(`https://localhost:7114/api/BoardingPoints?busid=${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBoardingPoints(bpresponse.data);

        const dpresponse = await axios.get(`https://localhost:7114/api/DroppingPoints?busid=${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDroppingPoints(dpresponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function inside useEffect
  }, [busId, token, navigate]);

  const handleSeatSelection = (seatNo) => {
    if (selectedSeats.length < 6 || selectedSeats.includes(seatNo)) {
      const index = selectedSeats.indexOf(seatNo);
      if (index === -1) {
        // Add new seat to selectedSeats
        setSelectedSeats([...selectedSeats, seatNo]);
      } else {
        // Remove seat from selectedSeats
        const updatedSeats = [...selectedSeats];
        updatedSeats.splice(index, 1);
        setSelectedSeats(updatedSeats);
      }
    }
  };

  const handlePassengerDetailsChange = (seatNo, key, value) => {
    const updatedDetails = { ...passengerDetails[seatNo], [key]: value };
    setPassengerDetails({ ...passengerDetails, [seatNo]: updatedDetails });
  };

  const handleBoardingPointChange = (event) => {
    const selectedPoint = event.target.value;
    setSelectedBoardingPointId(selectedPoint);
  };

  const handleDroppingPointChange = (event) => {
    const selectedPoint = event.target.value;
    setSelectedDroppingPointId(selectedPoint);
  };

  return (
    <>
  <Navbar />
  {/* <img src={wallpaper1} alt="wallpaper1" className="wallpaper1"/> */}
  <div className="wallpaper1"><br />
  <div className="seatSelectionContainer">
  
    <h1>Select your Seats</h1>

    <div>
      <label htmlFor="boardingPoint">Select Boarding Point:</label>
      <select id="boardingPoint" value={selectedBoardingPointId} onChange={handleBoardingPointChange}>
        <option value="">Boarding Point</option>
        {boardingPoints.map((point) => (
          <option key={point.boardingId} value={point.boardingId}>
            {point.placeName}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="droppingPoint">Select Dropping Point:</label>
      <select id="droppingPoint" value={selectedDroppingPointId} onChange={handleDroppingPointChange}>
        <option value="">Dropping Point</option>
        {droppingPoints.map((point) => (
          <option key={point.droppingId} value={point.droppingId}>
            {point.placeName}
          </option>
        ))}
      </select>
    </div>

    

    <div className="seats">
      {seats &&
        seats.map((seat) => (
          <div key={seat.seatNo} className={`seat ${seat.isBooked ? 'unavailable' : 'available'}`} onClick={() => handleSeatSelection(seat.seatNo)}>
            <input
              type="checkbox"
              id={`inlineCheckbox${seat.seatNo}`}
              value={seat.seatNo}
              disabled={seat.isBooked || (selectedSeats.length >= 6 && !selectedSeats.includes(seat.seatNo))}
              checked={selectedSeats.includes(seat.seatNo)}
              onChange={() => handleSeatSelection(seat.seatNo)}
            />
            <label className="form-check-label" htmlFor={`inlineCheckbox${seat.seatNo}`} data-price={`Rs.${seat.seatPrice}`}>
              {seat.seatNo}
            </label>
          </div>
        ))}
    </div>

    <div className="paymentText">
      <p>Total Seats Selected: {selectedSeats.length}</p>
      <p>Total Price: Rs.{selectedSeats.length * busFare}</p>
    </div>
    <div className="passengerDetailsSection">
      <h2>Passenger Details</h2>
      {selectedSeats.map((seatNo) => (
        <div key={seatNo} className="passengerDetails">
          <p>Seat Number: {seatNo}</p>
          <div className="passengerInput">
            <input
              type="text"
              placeholder="Name"
              value={passengerDetails[seatNo]?.name || ''}
              onChange={(e) => handlePassengerDetailsChange(seatNo, 'name', e.target.value)}
              required
            />
          </div>
          <div className="passengerInput">
            <select
              value={passengerDetails[seatNo]?.gender || ''}
              onChange={(e) => handlePassengerDetailsChange(seatNo, 'gender', e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="passengerInput">
            <input
              type="number"
              placeholder="Age"
              value={passengerDetails[seatNo]?.age || ''}
              onChange={(e) => handlePassengerDetailsChange(seatNo, 'age', e.target.value)}
              min="16"
              required
            />
          </div>
        </div>
      ))}
    </div>  

    <button className="payment" onClick={redirectToPayment} disabled={selectedSeats.length === 0}>
      Proceed to Payment
    </button>
  </div>
  </div>
</>

  );
};

export default SeatingArrangement;
