import React, { useState, useEffect } from 'react';
import styles from '../../caraousel.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrigin, selectDestination, selectTravelDate } from '../Redux/Actions';
import Navbar from '../Navbar/Navbar';
import wallpaper from '../../assets/wallpaper.jpg'; // Import the wallpaper image

function FromAndTo() {
    const cities = ['Delhi', 'Hyderabad', 'Bangalore', 'Mumbai', 'Chennai'];
    const sourceOptions = cities.map(city => (
        <option key={city} value={city}>{city}</option>
    ));

    const destinations = {
        'Hyderabad': ['Manali', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai'],
        'Manali': ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai'],
        'Bangalore': ['Hyderabad', 'Manali', 'Mumbai', 'Delhi', 'Chennai'],
        'Mumbai': ['Hyderabad', 'Manali', 'Bangalore', 'Delhi', 'Chennai'],
        'Delhi': ['Hyderabad', 'Manali', 'Bangalore', 'Mumbai', 'Chennai']
    };

    const token = sessionStorage.getItem('authToken');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [minDate, setMinDate] = useState('');
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        setMinDate(formattedToday);
    }, []);

    const Origin = useSelector(state => state.origin);
    const Destination = useSelector(state => state.destination);
    const TravelDate = useSelector(state => state.travelDate);
    const [errors, setErrors] = useState({});

    const destinationOptions = destinations[Origin.origin] || [];

    const handleOriginChange = (e) => {
        setErrors(prevState => ({ ...prevState, origin: '' }));
        dispatch(selectOrigin(e.target.value));
    };

    const handleDestinationChange = (e) => {
        setErrors(prevState => ({ ...prevState, destination: '' }));
        dispatch(selectDestination(e.target.value));
    };

    const handleTravelDateChange = (e) => {
        setErrors(prevState => ({ ...prevState, travelDate: '' }));
        dispatch(selectTravelDate(e.target.value));
    };

    const BusDetails = async () => {
        const errors = {};
        let isValid = true;

        if (!Origin.origin) {
            errors.origin = 'Please enter a source.';
            isValid = false;
        }

        if (!Destination.destination) {
            errors.destination = 'Please enter a destination.';
            isValid = false;
        }

        if (!TravelDate.travelDate) {
            errors.travelDate = 'Please select a travel date.';
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await axios.get(`https://localhost:7114/api/Buses/GetBusByDetails?origin=${Origin.origin}&destination=${Destination.destination}&date=${TravelDate.travelDate.split('T')[0]}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data)
                if (response.data.length === 0) {
                    alert("No buses available for the selected route and date.");
                } else {
                    navigate('/bus-list', { state: { buses: response.data } });
                }
            } catch (error) {
                console.log(error)
                alert("No buses available for the selected route and date.");
            }
        } else {
            let errorMessage = 'Please correct the following errors:\n';
            if (errors.origin) errorMessage += `- ${errors.origin}\n`;
            if (errors.destination) errorMessage += `- ${errors.destination}\n`;
            if (errors.travelDate) errorMessage += `- ${errors.travelDate}\n`;
            alert(errorMessage);
        }
    };

    return (
        <div>
            <Navbar />
            <img src={wallpaper} alt="wallpaper" className={styles.image} /> {/* Add the background image */}
            <div className={styles.fromAndTo}>
                <div className={styles.a}>
                    <div className={styles.ikHMPa}>
                        <div className={styles.outerContainer}>
                            <div className={styles.btnStyle}>
                                <div className={styles.iconStyle}>
                                    <i className="fa-solid fa-bus"></i>
                                    <div className={styles.outerinputStyle}>
                                        <div className={styles.inputStyle} style={{ marginTop: '-10px' }}>
                                            <label htmlFor="src">From</label>
                                            <select
                                                id="src"
                                                value={Origin.origin}
                                                onChange={handleOriginChange}
                                                className={styles.inputStyleA}
                                            >
                                                <option value="">Source</option>
                                                {sourceOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.jVMfHp}>
                            <i className="fa-solid fa-arrows-left-right"></i>
                        </div>
                        <div className={styles.outerContainer}>
                            <div role="button" className={styles.btnStyle}>
                                <div className={styles.iconStyle}>
                                    <i className="fa-solid fa-bus"></i>
                                    <div className={styles.outerinputStyle}>
                                        <div className={styles.inputStyle} style={{ marginTop: '-10px' }}>
                                            <label htmlFor="dest">To</label>
                                            <select
                                                id="dest"
                                                value={Destination.destination}
                                                onChange={handleDestinationChange}
                                                className={styles.inputStyleA} // Apply the same class as the source dropdown
                                            >
                                                <option value="">Destination</option>
                                                {destinationOptions.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.outerContainer}>
                            <input
                                type="date"
                                min={minDate}
                                value={TravelDate.travelDate}
                                onChange={handleTravelDateChange}
                                className={styles.c}
                            />
                            <button id="search_button" className={styles.busBtn} onClick={BusDetails}>
                                SEARCH BUSES
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {errors.origin && <h5 style={{ color: 'red' }}>{errors.origin}</h5>}
            {errors.destination && <h5 style={{ color: 'red' }}>{errors.destination}</h5>}
            {errors.travelDate && <h5 style={{ color: 'red' }}>{errors.travelDate}</h5>}
        </div>
    );
}

export default FromAndTo;
