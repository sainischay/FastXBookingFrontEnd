import './DetailsContainer.css';

function DetailsContainer({ booking }) {
  const {
    busName,
    busType,
    seatNo,
    passengerName,
    gender,
    age,
    boarding,
    dropping,
    bookingTime,
    departureDate,
    boardingTime,
    droppingTime,
    isCancelled
  } = booking;

  const parsedBookingTime = new Date(bookingTime);
  const parsedDepartureDate = new Date(departureDate);
  

  const formattedBookingTime = isNaN(parsedBookingTime) ? 'Not specified' : parsedBookingTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDepartureDate = isNaN(parsedDepartureDate) ? 'Not specified' : parsedDepartureDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  
  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';

    const [hours, minutes, seconds] = timeString.split(':');
    const formattedTime = `${parseInt(hours, 10) % 12 || 12}:${minutes}:${seconds || '00'} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
    return formattedTime;
  };

  const formattedBoardingTime = boardingTime ? formatTime(boardingTime) : 'Not specified';
  const formattedDroppingTime = droppingTime ? formatTime(droppingTime) : 'Not specified';

  return (
    <div className="detailsbusListingContainer">
      <div className="detailsbusCardContainer">
        <div className="detailsbusCard">
          <div className="detailheader">
            <h2 className="detailbusName">Bus Name: {busName}</h2>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Bus Type:</div>
            <div className="detailValue">{busType}</div>
            <div className="detailLabel">Seat Number:</div>
            <div className="detailValue">{seatNo}</div>
          </div>
          <div className="detailsRow">
           
            <div className="detailLabel">Passenger Name:</div>
            <div className="detailValue">{passengerName}</div>
            <div className="detailLabel">Gender:</div>
            <div className="detailValue">{gender}</div>
            <div className="detailLabel">Age:</div>
            <div className="detailValue">{age}</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Boarding Time:</div>
            <div className="detailValue">{boarding} ({formattedBoardingTime})</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Dropping Time:</div>
            <div className="detailValue">{dropping} ({formattedDroppingTime})</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Booking Date Time:</div>
            <div className="detailValue">{formattedBookingTime}</div>
            <div className="detailLabel">Departure Date:</div>
            <div className="detailValue">{formattedDepartureDate}</div>
            
                <div className="detail-label">Cancelled: </div>
                <div className="detail-value">{isCancelled?"Yes":"No"}</div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsContainer;
