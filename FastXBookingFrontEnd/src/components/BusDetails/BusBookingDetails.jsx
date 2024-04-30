import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BusOperatorNavbar from '../BusOperatorNavbar/BusOperatorNavbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DetailsContainer from '../DetailsContainer/DetailsContainer';
import './BusBookingDetails.css'
import AdminNavbar from '../AdminNavbar/AdminNavbar'


function BookingDetails() {
  const [allBookings, setAllBookings] = useState([]);
  const token = sessionStorage.getItem('authToken');
  const navigate = useNavigate();
  const { busId } = useParams();
  const location = useLocation();
  const role = sessionStorage.getItem('role')
  useEffect(() => {
    const fetchBusDetails = async () => {
      if(!(token && role=='Bus Operator'|| role=='Admin')){
        navigate('/login')
    }

      try {
        const response = await axios.get(
          `https://localhost:7114/api/BookingHistories/getAllBookingsByBusId/${busId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(response.data)
        const transformedAllBooking = response.data.flatMap((booking) =>({
          busType: booking.booking.bus.busType,
          busName: booking.booking.bus.busName,
          busNumber: booking.booking.bus.busNumber,
          bookingTime: booking.bookingDateTime,
          isCancelled : booking.isCancelled,
          boarding: booking.booking.boarding?booking.booking.boarding.placeName:'Not Specified',
          boardingTime: booking.booking.boarding.timings,
          dropping: booking.booking.dropping.placeName,
          droppingTime: booking.booking.dropping.timings,
          departureDate: new Date(booking.booking.bus.departureDate),
          origin: booking.booking.bus ? booking.booking.bus.origin : 'Not specified',
          destination:  booking.booking.bus ? booking.booking.bus.destination : 'Not specified',
          seatNo: booking.seats,
          passengerName: booking.passengerName,
          gender: booking.gender,
          age: booking.age
      })
  )
      setAllBookings(transformedAllBooking);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.alert('Unauthorized');
          navigate('/login');
        }
        console.error('Error fetching bus details:', error.message);
      }
    };

    fetchBusDetails();
  }, [busId, token, navigate]); // Include dependencies for useEffect

  // Determine if this tab should be active based on the route
  const isActiveTab = location.pathname.includes('/booking-details');

  return (
    <>
    {role === 'Admin' ? <AdminNavbar /> : <BusOperatorNavbar />}
  <div className="container-fluid status-container">
    <ul className="nav nav-tabs statustabs">
      <li className="nav-item tab-item">
        <a className={`nav-link active`} href="#allBookingsTab">
          All Bookings
        </a>
      </li>
    </ul>

    <div className={`tab-content`}>
      <div className={`tab-pane fade show active`} id="allBookingsTab">
        <h4>All Bookings</h4>
        {allBookings.length === 0 ? (
          <p>No cancelled bookings</p>
        ) : (
          <div className="bookingBusListingContainer">
            <div className="busCardContainer">
              {allBookings.map((booking) => (
                <div key={booking.bookingId} className="historyBusCard">
                  <DetailsContainer booking={booking} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</>

  );
}

export default BookingDetails;
