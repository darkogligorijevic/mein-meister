import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Order = () => {
  const [workerId, setWorkerId] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.userId;

  const fetchWorkerId = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/workers/userId/${userId}`);
      setWorkerId(response.data._id);
    } catch (err) {
      console.log(err);
      // Handle the error here, e.g., show an error message to the user
    }
  }, [userId]);

  const fetchAllOrdersByWorkerId = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`http://localhost:5000/api/orders/worker/${workerId}`, config);
      console.log('orders:', response.data);
      setOrders(response.data);
    } catch (err) {
      console.log(err);
      // Handle the error here, e.g., show an error message to the user
    }
  }, [workerId]);

  useEffect(() => {
    const fetchWorkerData = async () => {
      await fetchWorkerId();
      await fetchAllOrdersByWorkerId();
    };

    fetchWorkerData();
  }, [fetchWorkerId, fetchAllOrdersByWorkerId]);

  const handleAcceptOrder = async () => {
    // Update the selected order's isAccepted and scheduledDate fields
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.patch(
        `http://localhost:5000/api/orders/${selectedOrder._id}`,
        {
          isAccepted: true,
          scheduledDate: selectedDate,
        },
        config
      );
      // Handle success
    } catch (err) {
      // Handle error
      console.log(err);
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div>
      {orders?.map((order) => (
        <div key={order._id}>
          <div dangerouslySetInnerHTML={{ __html: order.description }} />
          {!order.isAccepted && (
            <>
              {selectedOrder === order && (
                <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
              )}
              <button
                className='px-4 py-2 bg-red-500'
                onClick={() => handleOrderSelect(order)}
              >
                Prihvati
              </button>
              {selectedOrder === order && (
                <button
                  className='px-4 py-2 bg-green-500'
                  onClick={handleAcceptOrder}
                >
                  Potvrdi
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Order;
