import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FileInput from '../components/FileInput';
import CategorySelection from '../components/CategorySelection';

const CreatePost = () => {
  const state = useLocation().state
  const [inputs, setInputs] = useState({
    title: state?.title || '',
    description: state?.description || '',
    city: state?.city || '',
    category: state?.category || '',
    price: state?.price || '',
    imageUrl: null,
  });

  const params = useParams()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const postId = searchParams.get('edit');
  const workerId = params.id


  const navigate = useNavigate();


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (acceptedFiles) => {
    setInputs((prev) => ({ ...prev, imageUrl: acceptedFiles[0] }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setInputs((prev) => ({ ...prev, category: selectedCategory }));
  };

  const [err, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    formData.append('city', inputs.city);
    formData.append('category', inputs.category);
    formData.append('price', inputs.price);
    formData.append('imageUrl', inputs.imageUrl);

    const token = localStorage.getItem("token")

    try {
      state ? await axios.patch(`http://localhost:5000/api/posts/update/${postId}/worker/${workerId}`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              navigate(`/post/${postId}`);
            })
            .catch((error) => {
              console.log(error);
              setError(error.response.data.message);       
      })
            : await axios.post(`http://localhost:5000/api/posts/${workerId}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              navigate('/posts');
            })
            .catch((error) => {
              console.log(error);
              setError(error.response.data.message);
            });
    } catch (err) {
      console.log(err)
    }
  };

  const handleCitySelect = (selectedCity) => {
    setInputs((prev) => ({ ...prev, city: selectedCity }));
  };

  console.log(inputs);

  return (
    <div className='h-screen py-[128px]'>
    <div className="max-w-4xl p-6 mx-auto bg-orange-500 rounded-md shadow-md dark:bg-gray-800 mt-20">
        <h1 className="text-xl font-bold text-white capitalize dark:text-white">Dodajte uslugu</h1>
        <form>
            <div className="grid grid-cols-1 gap-6 mt-4">
                <div>
                    <label className="text-white dark:text-gray-200" for="title">Naslov</label>
                    <input value={inputs.title} onChange={handleChange} name="title" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />  {/* this is working as well as other with input type="text" and type="number" because of value */}
                </div>
                <div>
                    <label className="flex mb-2 text-white dark:text-gray-200" for="category">Delatnost</label>
                    <CategorySelection value={inputs.category} onChange={handleCategoryChange} />                
                </div>
                <div>
                    <label className="flex mb-2 text-white dark:text-gray-200" for="city">Izaberite grad</label>
                    <SearchBar onCitySelect={handleCitySelect} value={inputs.city} /> 
                </div>
                 <div>
                    <label className="text-white dark:text-gray-200" for="price">Cena</label>
                    <input value={inputs.price} onChange={handleChange} name="price" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
                <div>
                    <label className="text-white dark:text-gray-200" for="description">Deskripcija</label>
                    <textarea value={inputs.description} onChange={handleChange} name="description" type="textarea" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"></textarea>
                 </div>
                <FileInput name='imageUrl' onChange={handleFileChange} />
                
            </div>

            <div className="flex justify-start mt-6">
                <button onClick={handleSubmit} className="px-8 py-2 leading-5 border font-black hover:scale-105 border-white text-white transition-colors duration-200 transform rounded-md hover:bg-black hover:border-transparent focus:outline-none">Napravite uslugu</button>
            </div>
            {err && <span className='text-red-500 block text-center bg-gray-200 py-4 mt-3'>{err}</span>}
        </form>
    </div>
    </div>
  )
}

export default CreatePost