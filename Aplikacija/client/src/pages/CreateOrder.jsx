import React, { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { DatePicker } from 'react-rainbow-components';

const CreateOrder = () => {
  const [inputs, setInputs] = useState({
    phoneNumber: '',
    description: '',
    selectedDate: null, // Add selectedDate to inputs state
  });

  const [err, setError] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDescriptionChange = (value) => {
    setInputs((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `http://localhost:5000/api/orders/post/${postId}`,
        inputs,
        config
      );
      console.log(config);
      console.log(response);
      navigate('/posts');
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  const handleDateChange = (value) => {
    setInputs((prev) => ({ ...prev, selectedDate: value })); // Update selectedDate in inputs state
  };

  console.log(inputs);

  return (
    <div className="py-[128px]">
      <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        <div className="p-12 shadow-lg">
          <h1 className="text-2xl font-black text-black">Posaljite Vase informacije majstoru</h1>
          <form>
            <div className="grid grid-cols-1 gap-6 mt-4">
              <div>
                <label className="text-gray-500" htmlFor="phoneNumber">
                  Broj telefona
                </label>
                <input
                  onChange={handleChange}
                  name="phoneNumber"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 border text-gray-900 outline-none rounded-md"
                />
              </div>
              <div>
                <label className="text-gray-500 dark:text-gray-200" htmlFor="description">
                  Opisite sto detaljnije svoj problem
                </label>
                <ReactQuill
                  onChange={handleDescriptionChange}
                  name="description"
                  className="block mt-2 mb-12 h-36"
                />
              </div>
              <div className="w-1/3">
                <DatePicker
                  value={inputs.selectedDate}
                  onChange={handleDateChange}
                  placeholder="Izaberite datum"
                  formatStyle="medium"
                  borderRadius="semi-square"
                  name='scheduledDate'
                />
              </div>
            </div>

            <div className="flex justify-start mt-6">
              <PrimaryButton
                content="Zaposlite majstora"
                onClick={handleSubmit}
                primaryColor="black"
                secondaryColor="white"
              />
            </div>
            {err && (
              <span className="text-red-500 block text-center bg-gray-200 py-4 mt-3">{err}</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
