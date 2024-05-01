import React, { useState, useEffect } from "react";
import './AddBus.css'
import BusOperatorNavbar from '../BusOperatorNavbar/BusOperatorNavbar';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function AddBus() {
    const [currentStep, setCurrentStep] = useState(1);
    const [busName, setBusName] = useState("");
    const [busNumber, setBusNumber] = useState("");
    const [busType, setBusType] = useState("");
    const [noOfSeats, setNoOfSeats] = useState("");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [fare, setFare] = useState(0);
    const [departureDate,setDepartureDate]=useState("")
    const [boardingPoints,setBoardingPoints]=useState([])
    const [boardTimings,setBoardTimings]=useState([])
    const [droppingPoints,setDroppingPoints]=useState([])
    const [dropTimings,setDropTimings]=useState([])
    const [busRoute,setBusRoute]=useState([])
    const [boardingPointss,setBoardingPointss]=useState([])
    const [boardTimingss,setBoardTimingss]=useState([])
    const [droppingPointss,setDroppingPointss]=useState([])
    const [dropTimingss,setDropTimingss]=useState([])
    const [busRoutes,setBusRoutes]=useState([])
    const [busId,setBusId]=useState(null)
    const navigate=useNavigate()

    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const token=sessionStorage.getItem('authToken');
    const role=sessionStorage.getItem('role')


    useEffect(() => {
        console.log(role)
        if(!(token && role=='Bus Operator')){
            navigate('/login')
        }
        const getAmenities =async () => {
            try{
                const amenresponse = await axios.get(`https://localhost:7114/api/Amenities`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                })
                console.log(amenresponse.data)
                setAmenities(amenresponse.data)
               
            }catch(error){
                console.log(error)
            }
        };
    
        getAmenities();
    }, [busId]);
    const [minDate, setMinDate] = useState('');
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        setMinDate(formattedToday);
    }, []);

    const nextStep = async () => {
        if (!busName || !busNumber || !busType || !noOfSeats || !origin || !destination || !startTime || !endTime || !fare || !departureDate || !boardingPoints || !boardTimings || !droppingPoints || !dropTimings || !busRoute) {
            window.alert("Please fill in all fields.");
            return;
        }
    
        const bps=boardingPoints.split(",").map(point => point.trim());
        const bpt=boardTimings.split(",").map(point => point.trim());
        const dps=droppingPoints.split(",").map(point => point.trim());
        const dpt=dropTimings.split(",").map(point => point.trim());
        const route= busRoute.split(",").map(point => point.trim());

        
          
        setBoardingPointss(bps)
        setBoardTimingss(bpt)
        setDroppingPointss(dps)
        setDropTimingss(dpt)
        setBusRoutes(route)
        
        
         if(boardingPointss.length!=boardTimingss.length){
            window.alert("Boarding points and timings do not match")
                return
         }

         if(droppingPointss.length!=dropTimingss.length){
            window.alert("Dropping points and timings do not match")
            return
        }

    

    if (endTime <= startTime) {
        window.alert("End Time should be at least 1 hour greater than Start Time.");
        return
    }


    try {
        const response = await axios.post(`https://localhost:7114/api/Buses`, {
            busName: busName,
            busType: busType,
            busNumber: busNumber,
            noOfSeats: noOfSeats,
            origin:origin,
            destination:destination,
            startTime:startTime,
            endTime:endTime,
            fare:fare,
            busOperator:sessionStorage.getItem('userId'),
            departureDate:departureDate
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Response "+response.data.busId);
        setBusId(response.data.busId);
    }catch(error){
            console.error(error)
        }
        console.log(busId)
        console.log(boardTimings)
       

        console.log(route)
        console.log(bps)
        
      
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const addBus = async () => {
    
        console.log(boardingPointss)
        console.log(droppingPointss)
        console.log("BusId"+busId)

        if(boardingPointss.length===boardTimingss.length){
            try{
            for(let i=0;i<boardingPointss.length;i++){
                
                    await axios.post(`https://localhost:7114/api/BoardingPoints`,
                    {
                        placeName:boardingPointss[i],
                        timings:boardTimingss[i],
                        busId:busId
                    },
                  {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                  }
                )
                
            }
        }catch(error){
            window.alert(error)
        }
        }
        else{
            window.alert("Boarding points and timings do not match")
            return
        }

        if(droppingPointss.length===dropTimingss.length){
            for(let i=0;i<droppingPointss.length;i++){
                try{
                   await axios.post(`https://localhost:7114/api/DroppingPoints`,
                    {
                        placeName:droppingPointss[i],
                        timings:dropTimingss[i],
                        busId:busId
                    },
                  {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                  }
                )
                }catch(error){
                    window.alert(error)
                }
            }
        }
        else{
            window.alert("Dropping points and timings do not match")
            return
        }


        if(busRoutes.length>0){
            for(let i=0;i<busRoutes.length;i++){
                try{
                   await axios.post(`https://localhost:7114/api/Routes`,
                    {
                        placeName:busRoutes[i],
                        busId:busId
                    },
                  {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                  }
                )
                }catch(error){
                    window.alert(error)
                }
            }
        }
        else{
            window.alert("Routes cannot be empty")
            return
        }

          
            if (selectedAmenities.length > 0) {
                for (let i = 0; i < selectedAmenities.length; i++) {
                    const response= await axios.post(`https://localhost:7114/api/Buses/PostBusAmenities?busid=${busId}&amenityid=${selectedAmenities[i]}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                });
                }
            }
            window.alert("Successfully Created")
            navigate(`/busDetails/${sessionStorage.getItem('userId')}`)
            
        };


        const addAmenitiesForBus = (busId, amenityNames) => {
       

        fetch("http://localhost:5263/api/BusOperator/AddAmenitiesToBus", requestOptions)
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                // Handle the response if needed
            })
            .catch(err => console.log(err));
        };

    const handleCheckboxChange = (e, amenityName) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedAmenities([...selectedAmenities, amenityName]);
        } else {
            setSelectedAmenities(selectedAmenities.filter(name => name !== amenityName));
        }
    };

    const renderFormStep = () => {
        <BusOperatorNavbar/>
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="mb-3">
                            <label htmlFor="busName" className="form-label">Bus Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="busName"
                                value={busName}
                                onChange={(e) => setBusName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="busnumber" className="form-label">Bus Number:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="busnumber"
                                value={busNumber}
                                onChange={(e) => setBusNumber(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bustype" className="form-label">Bus Type:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="bustype"
                                value={busType}
                                onChange={(e) => setBusType(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
    <label htmlFor="noofseats" className="form-label">Total Number of Seats:</label>
    <input
        type="number"
        className="form-control"
        id="noofseats"
        value={noOfSeats}
        min={16}
        max={24}
        step={4}
        onChange={(e) => setNoOfSeats(e.target.value)}
    />
</div>

                        <div className="mb-3">
                            <label htmlFor="origin" className="form-label">Origin</label>
                            <input
                                type="text"
                                className="form-control"
                                id="origin"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="destination" className="form-label">Destination</label>
                            <input
                                type="text"
                                className="form-control"
                                id="destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="starttime" className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-control"
                                id="starttime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endtime" className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-control"
                                id="endtime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fare" className="form-label">Fare</label>
                            <input
                                type="number"
                                className="form-control"
                                id="fare"
                                value={fare}
                                onChange={(e) => setFare(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="daparturedate" className="form-label">Departure Date</label>
                            <input
                                type="date"
                                min={minDate}
                                className="form-control"
                                id="daparturedate"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="boardingpoints" className="form-label">Boarding Points</label>
                            <input
                                type="text"
                                className="form-control"
                                id="boardingpoints"
                                value={boardingPoints}
                                onChange={(e) => setBoardingPoints(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="boardingtimings" className="form-label">Boarding Timings</label>
                            <input
                                type="text"
                                className="form-control"
                                id="boardingtimings"
                                value={boardTimings}
                                onChange={(e) => setBoardTimings(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="droppingpoints" className="form-label">Dropping Points</label>
                            <input
                                type="text"
                                className="form-control"
                                id="droppingpoints"
                                value={droppingPoints}
                                onChange={(e) => setDroppingPoints(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="droppingtimings" className="form-label">Dropping Timings</label>
                            <input
                                type="text"
                                className="form-control"
                                id="boardingtimings"
                                value={dropTimings}
                                onChange={(e) => setDropTimings(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="busroute" className="form-label">Bus Route</label>
                            <input
                                type="text"
                                className="form-control"
                                id="busroute"
                                value={busRoute}
                                onChange={(e) => setBusRoute(e.target.value)}
                            />
                        </div>
                        <button onClick={nextStep} className="btn btn-primary">Next</button>
                    </>
                );
            case 2:
                return (
                    <>

                        <div className="mb-3">
                            <label className="form-label">Select Amenities:</label>
                            {amenities.map(amenity => (
                                <div key={amenity.amenityId} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={amenity.amenityId}
                                        value={amenity.amenityName}
                                        checked={selectedAmenities.includes(amenity.amenityId)}
                                        onChange={(e) => handleCheckboxChange(e, amenity.amenityId)}
                                    />
                                    <label className="form-check-label" htmlFor={amenity.amenityName}>
                                        {amenity.amenityName}
                                    </label>
                                </div>
                            ))}
                        </div>


                        <button onClick={prevStep} className="btn btn-secondary mr-2">Previous</button>
                        <button onClick={addBus} className="btn btn-primary">Submit</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mt-5 black">
            <h2>Bus Information Form - Step {currentStep}</h2>
            {renderFormStep()}
        </div>
    );
}

export default AddBus;














