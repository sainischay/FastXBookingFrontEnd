import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import RegisterUser from './components/RegisterUser/RegisterUser';
import UserLogin from './components/Login/Login';
import RegisterBusOperator from './components/RegisterBusOperator/RegisterBusOperator';
import FromAndTo from './components/FromandTo/FromandTo';
import BusDetails from './components/BusDetails/BusDetails';
import { Provider } from 'react-redux';
import store from './components/Redux/Store';
import Bus from './components/Bus/Bus'
import SeatingArrangement from './components/SeatingArrangement/SeatingArrangement';
import Payment from './components/Payment/Payment';
import PaymentSuccess from './components/PaymentSuccess/PaymentSuccess'
import BookingHistory from './components/BookingHistory/BookingHistory';
import AddBus from './components/AddBus/AddBus'
import BookingDetails from './components/BusDetails/BusBookingDetails';
import BusOperatorDetails from './components/BusOperatorDetails/BusOperatorDetails'
import UserDetails from './components/UserDetails/UserDetails'
import UserBookings from './components/UserDetails/UserBookings'


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/registerBusOperator" element={<RegisterBusOperator />} />
          <Route path="/fromAndTo" element={<FromAndTo />} />
          <Route path="/busDetails/:userId" element={<BusDetails />} />
          <Route path="/bus-list" element={<Bus />} />
          <Route path="/seating/:busId" element={<SeatingArrangement />} />
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/paymentsuccess" element={<PaymentSuccess/>}/> 
          <Route path="/bookinghistory" element={<BookingHistory/>}/>
          <Route path="/addbus" element={<AddBus/>}/>
          <Route path="/booking-details/:busId" element={<BookingDetails />} />
          <Route path="/busOperatorDetails" element={<BusOperatorDetails />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/userBookings/:userId" element={<UserBookings />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
