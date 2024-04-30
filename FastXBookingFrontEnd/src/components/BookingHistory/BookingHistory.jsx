import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DetailsContainer from '../DetailsContainer/DetailsContainer';
import Navbar from '../Navbar/Navbar';
import './BookingHistory.css';

function BookingHistory() {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('tab1'); // State to manage active tab
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('authToken');
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role')

  useEffect(() => {
    if(!(token && (role=='Bus Operator' || role=='User'))){
      navigate('/login')
  }

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://localhost:7114/api/Bookings/getBookingsByUserId/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const transformedBookingInfo = response.data.flatMap((booking) =>
          booking.seats.map((seat) => ({
            bookingId: booking.bookingId,
            busType: booking.bus.busType,
            busName: booking.bus.busName,
            seatId: seat.seatId,
            busNumber: booking.bus.busNumber,
            bookingTime: seat.bookingDateTime,
            departureDate: new Date(booking.bus.departureDate),
            boarding: booking.boarding ? booking.boarding.placeName : 'Not specified',
            dropping: booking.dropping ? booking.dropping.placeName : 'Not specified',
            boardingTime: booking.boarding ? booking.boarding.timings : 'Not specified',
            droppingTime: booking.dropping ? booking.dropping.timings : 'Not specified',
            seatNo: seat.seatNumber,
            passengerName: seat.passengerName,
            gender: seat.gender,
            age: seat.age
          }))
        );

        transformedBookingInfo.sort((a, b) => a.departureDate - b.departureDate);
        console.log(transformedBookingInfo)
        setBookingInfo(transformedBookingInfo);

        const cancelledResponse = await axios.get(`https://localhost:7114/api/BookingHistories/getCancelledBookingsByUserId/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const transformedBooking = cancelledResponse.data.flatMap((booking) =>({
            busType: booking.booking.bus.busType,
            busName: booking.booking.bus.busName,
            busNumber: booking.booking.bus.busNumber,
            bookingTime: booking.bookingDateTime,
            boarding: booking.booking.boarding.placeName,
            boardingTime: booking.booking.boarding.timings,
            dropping: booking.booking.dropping.placeName,
            droppingTime: booking.booking.dropping.timings,
            departureDate: new Date(booking.booking.bus.departureDate),
            origin: booking.booking.bus ? booking.booking.bus.origin : 'Not specified',
            destination:  booking.booking.bus ? booking.booking.bus.destination : 'Not specified',
            seatNo: booking.seats,
            passengerName: booking.passengerName,
            gender: booking.gender,
            age: booking.age,
            isCancelled: booking.isCancelled
        })
    )
        setCancelledBookings(transformedBooking);


        const allBookResponse = await axios.get(`https://localhost:7114/api/BookingHistories/getAllBookingsByUserId/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const transformedAllBooking = allBookResponse.data.flatMap((booking) =>({
            busType: booking.booking.bus.busType,
            busName: booking.booking.bus.busName,
            busNumber: booking.booking.bus.busNumber,
            bookingTime: booking.bookingDateTime,
            boarding: booking.booking.boarding.placeName,
            boardingTime: booking.booking.boarding.timings,
            dropping: booking.booking.dropping.placeName,
            droppingTime: booking.booking.dropping.timings,
            departureDate: new Date(booking.booking.bus.departureDate),
            origin: booking.booking.bus ? booking.booking.bus.origin : 'Not specified',
            destination:  booking.booking.bus ? booking.booking.bus.destination : 'Not specified',
            seatNo: booking.seats,
            passengerName: booking.passengerName,
            gender: booking.gender,
            age: booking.age,
            isCancelled: booking.isCancelled
        })
    )
        setAllBookings(transformedAllBooking);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userId, token, navigate,role]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId); // Update active tab state
  };
  const confirmCancellation = async (seatId) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this booking?');
    
    if (isConfirmed) {
      try {
        await axios.delete(`https://localhost:7114/api/Seats/${seatId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        console.log('Booking cancelled successfully.');
        alert('Booking cancelled successfully. Refund will be processed within 2 to 3 business days.');
        window.location.reload(); 
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    } else {
      console.log('Booking cancellation cancelled by user.');
    }
    
  };

  return (
    <>
    <Navbar/>
    <div className="DetailsContainer.container-fluid status-container">
      <ul className="nav nav-tabs statustabs">
        <li className="nav-item tab-item">
          <a className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`} onClick={() => handleTabChange('tab1')}>
            Upcoming
          </a>
        </li>
        <li className="nav-item tab-item">
          <a className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`} onClick={() => handleTabChange('tab2')}>
            Cancelled
          </a>
        </li>
        <li className="nav-item tab-item">
          <a className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => handleTabChange('tab3')}>
            All Bookings
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`}>
          <h4>Upcoming Bookings</h4>
          {bookingInfo.length === 0 ? (
            <p>No upcoming bookings</p>
          ) : (
            <div className="bookingBusListingContainer">
              <div className="busCardContainer">
                {bookingInfo.map((booking) => (
                  <div key={booking.bookingId} className="historyBusCard">
                    <DetailsContainer booking={booking} />
                    <button onClick={() => confirmCancellation(booking.seatId)} className="btn btn-danger">
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`}>
          <h4>Cancelled Bookings</h4>
          {cancelledBookings.length === 0 ? (
            <p>No cancelled bookings</p>
          ) : (
            <div className="bookingBusListingContainer">
              <div className="busCardContainer">
                {cancelledBookings.map((booking) => (
                  <div key={booking.bookingId} className="historyBusCard">
                    <DetailsContainer booking={booking} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={`tab-pane fade ${activeTab === 'tab3' ? 'show active' : ''}`}>
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

export default BookingHistory;
