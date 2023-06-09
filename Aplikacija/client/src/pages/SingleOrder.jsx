import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { DateTimePicker } from 'react-rainbow-components';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const SingleOrder = () => {
  const state = useLocation().state
  const [order, setOrder] = useState([]);
  const [inputs, setInputs] = useState({
    isAccepted: state?.isAccepted || false,
    scheduledDate: state?.scheduledDate || null,
  });
  const [initialScheduledDate, setInitialScheduledDate] = useState(null);
  const navigate = useNavigate()
  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    const fetchSingleOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
        console.log(response.data);
        setOrder(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSingleOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
        const orderData = response.data;
  
        setInitialScheduledDate(orderData.scheduledDate);
        
        // ... other code
      } catch (err) {
        console.log(err);
        // TODO: Handle error and notify the user
      }
    };
  
    fetchOrderDetails();
  }, [orderId]);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return `${formattedDate} u ${formattedTime}h.`;
  };

  const handleDateChange = (value) => {
    setInputs((prev) => ({ ...prev, scheduledDate: value }));
  };

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const updatedData = {
        isAccepted: true,
        scheduledDate: inputs.scheduledDate || order.scheduledDate,
      };
  
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, config, updatedData);
      navigate('/orders');
    } catch (err) {
      console.log(err);
    }
  };
  
  console.log(inputs)

  return (
    <div className="py-[128px] min-h-screen">
      <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold">
            Informacije koje je korisnik{' '}
            {order.userId && (
              <span className="font-black">
                {order.userId.firstName + ' ' + order.userId.lastName}
              </span>
            )}{' '}
            ostavio/la Vama:
          </h1>
          <div className="flex flex-col gap-8">
            <p className='flex flex-col gap-2'>
              <span className='font-bold'>Opis problema:</span> {order.description && parse(order.description)}
            </p>
            <div className='flex flex-col md:flex-row gap-4'>
              <a href={`tel:${order.phoneNumber}`} className='md:self-start' >
                <div className='flex gap-4 px-8 py-2 border border-gray-400 rounded-md text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 duration-300 cursor-pointer'>
                  <PhoneIcon />
                  <span>{order.phoneNumber}</span>
                </div>
              </a>
              <a href={`mailto:${order.userId && order.userId.email}`} className='md:self-start' >
              <div className='flex gap-4 px-8 py-2 border border-gray-400 rounded-md text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 duration-300 cursor-pointer'>
                  <EmailIcon />
                  <span>{order.userId && order.userId.email}</span>
                </div>
              </a>
              
              <div className='flex gap-4 px-8 py-2 border border-gray-400 rounded-md md:self-start text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 duration-300 cursor-pointer'>
                <CalendarMonthIcon />
                <span>{formatDate(order.scheduledDate)}</span>
              </div>
            </div>
            
            { !order.isAccepted ?
            <div className='flex flex-col gap-4'>
                <p>
                    Ukoliko imate bilo kojih dodatnih pitanja vezana za korisnika, savetujemo Vas da ga kontaktirate. Ukoliko i samo ukoliko se dogovorite za drugi termin, imate prava promeniti ga ovde.
                </p>
                <div className='w-1/3'>
                    <DateTimePicker
                        value={inputs.scheduledDate || initialScheduledDate}
                        onChange={handleDateChange}
                        placeholder="Izaberite datum i vreme"
                        formatStyle="medium"
                        borderRadius="semi-square"
                        name="scheduledDate"
                        hour24={true}
                        locale="sr"
                        minDate={new Date()}
                        required={true}
                    />
                </div>
                <div>
                    <button onClick={handleAccept} className='px-4 py-2 bg-green-500 text-white font-black'>Prihvati</button>
                    <button className='px-4 py-2 bg-red-500 text-white font-black'>Odbij</button>
                </div>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
