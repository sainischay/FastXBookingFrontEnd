import React, { useEffect,useState } from 'react';
import './Bus.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setBusInfo } from '../Redux/Actions';
import Navbar from '../Navbar/Navbar';

function Bus() {
  const [amenities, setAmenities] = useState({});
  const role = sessionStorage.getItem('role')
  const [busTypeFilter, setBusTypeFilter] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { buses } = location.state;

  useEffect(()=>{
    const token = sessionStorage.getItem('authToken')
    if(!(token && role=='User')){
      navigate('/login')
  }
    const fetchAmenities=(busId)=>{
      try{
        const response = axios.get(`https://localhost:7114/api/Amenities/GetAmenitiesByBusId/${busId}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAmenities({ ...amenities, [busId]: response.data });
      }catch (error) {
        console.error('Error fetching amenities:', error);
    }

}})
  

useEffect(() => {
  if (busTypeFilter.length > 0) {
    const filtered = buses.filter(bus => busTypeFilter.includes(bus.busType));
    setFilteredBuses(filtered);
  } else {
    // If no filter selected, reset to all buses
    setFilteredBuses(buses);
  }
}, [busTypeFilter, buses]);




  function calculateDuration(startTime, endTime) {
    // Parse start time and end time strings into Date objects
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
  
    // Calculate the difference in milliseconds between end and start
    const durationMs = end - start;
  
    // Convert milliseconds to hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
    // Format the duration string
    const durationString = `${hours}h ${minutes}m`;
  
    return durationString;
  }

  const getAvailableSeatsCount = (busData) => {
    const availableSeats = busData.filter((seat) => !seat.isBooked);
    const count = availableSeats.length; // Count of available seats
    return count;
  };
  
  const handleSelectSeats = (busId, busName, busType,busFare) => {
    dispatch(setBusInfo(busName, busType, busId));
    sessionStorage.setItem('busFare',busFare)
    sessionStorage.setItem('busId',busId)
    navigate(`/seating/${busId}`);
  };


  const handleBusTypeFilter = (type) => {
    if (busTypeFilter.includes(type)) {
      // Remove the type if already selected
      setBusTypeFilter(prevFilter => prevFilter.filter(item => item !== type));
    } else {
      // Add the type if not selected
      setBusTypeFilter(prevFilter => [...prevFilter, type]);
     
    }
    console.log(busTypeFilter)
  };
  
  return (
    <div>
      <Navbar/>
      <div class="sidebar">
      <p>Bus Type:</p> 
      <div className="filter-options">
        <ul>
          <li>
          <input type="checkbox" value="AC" onChange={() => handleBusTypeFilter('AC')} /> AC
          </li>
          <li>
          <input type="checkbox" value="Non AC" onChange={() => handleBusTypeFilter('Non AC')} /> Non AC
          </li>
        <li>
          <input type="checkbox" value="Sleeper" onChange={() => handleBusTypeFilter('Sleeper')} /> Sleeper
          </li>
       <li>
          <input type="checkbox" value="Sleeper AC" onChange={() => handleBusTypeFilter('Sleeper AC')} /> Sleeper AC
          </li>
          </ul>
      </div>
      </div>
  {filteredBuses.map((bus) => (
    <div key={bus.busId}>
      <div
        id="busList"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          backgroundColor: 'rgb(245, 245, 245)',
        }}
      >
        <div style={{ margin: 'auto' }}>
          <div className="busListingContainer">
            <div className="busCardContainer">
              <div className="busCard">
                {/* Left section with bus name, type, and amenities */}
                <div className="makeFlex">
                  <div className="makeFlex column appendBottom22 busInfo">
                    <div className="makeFlex">
                      <div></div>
                      <div>
                        <p className="makeFlex hrtlCenter appendBottom8 latoBold blackText appendRight15">
                          {bus.busName}
                        </p>
                      </div>
                    </div>
                    <p className="makeFlex hrtlCenter secondaryTxt nowrapStyle">{bus.busType}</p>
                    {/* Display bus amenities */}
                    <div>
                      {bus.busAmenities && (
                        <div className="amenitiesContainer">
                          <p className="amenitiesHeader">Amenities:</p>
                          <ul className="amenitiesList" >
                            {bus.busAmenities.map((amenity) => (
                              <li key={amenity.id}>{amenity.amenity.amenityName}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Right section with start time, end time, and duration */}
                  <div className="startTimeEndTimeContainer">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p className="startTime">{bus.startTime.slice(0, 5)}</p>
                        <p style={{ fontSize: '20px' }}>➜</p>
                        <p className="endTime">{bus.endTime.slice(0, 5)}</p>
                      </div>
                      <div style={{ marginTop: '-10px' }}>
                        {/* Calculate duration */}
                        <p style={{ fontSize: '12px', color: 'gray' }}>
                          Duration: {calculateDuration(bus.startTime, bus.endTime)}
                        </p>
                      </div>
                      <p className="font12" style={{ color: 'green' }}/>
                          Seats Available: {getAvailableSeatsCount(bus.busSeats)}
                    </div>
                    
                    
                    <div className="makeFlex spaceBetween">
                  <div className="busCardFooter makeFlex spaceBetween">
                    <ul className="makeFlex hrtlCenter font12 noSelection">
                      <span className="listingSprite newPrimoIcon appendRight24"></span>
                    </ul>
                    <button className="sc-jKJlTe fnCpOO select-seats" onClick={() => handleSelectSeats(bus.busId, bus.busName, bus.busType, bus.fare)}>
                      Select Seats
                    </button>
                  </div>
                </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  ))}
</div>

  );
}
export default Bus;
