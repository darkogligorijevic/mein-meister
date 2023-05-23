import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FileInput from '../components/FileInput';
import CategorySelection from '../components/CategorySelection';
import PrimaryButton from '../components/PrimaryButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  const state = useLocation().state
  const [inputs, setInputs] = useState({
    title: state?.title || '',
    description: state?.description || '',
    city: state?.city || '',
    category: state?.category || '',
    price: state?.price || '',
    imageUrl: state?.imageUrl || null,
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
  
  const handleDescriptionChange = (value) => {
    setInputs((prev) => ({ ...prev, description: value }));
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
    <div className="py-[128px]">
        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
          <div className='p-12 shadow-lg'>
            <h1 className="text-2xl font-black text-black">Dodajte uslugu</h1>
            <form>
                <div className="grid grid-cols-1 gap-6 mt-4">
                    <div>
                        <label className="text-gray-500" for="title">Naslov</label>
                        <input value={inputs.title} onChange={handleChange} name="title" type="text" className="block w-full px-4 py-2 mt-2 border text-gray-900 outline-none rounded-md" />  {/* this is working as well as other with input type="text" and type="number" because of value */}
                    </div>
                    <div>
                        <label className="flex mb-2 text-gray-500 dark:text-gray-200" for="category">Delatnost</label>
                        <CategorySelection value={inputs.category} onChange={handleCategoryChange} />                
                    </div>
                    <div>
                        <label className="flex mb-2 text-gray-500 dark:text-gray-200" for="city">Izaberite grad</label>
                        <SearchBar onCitySelect={handleCitySelect} /> 
                    </div>
                    <div>
                        <label className="text-gray-500 dark:text-gray-200" for="price">Cena</label>
                        <input value={inputs.price} onChange={handleChange} name="price" type="number" className="block w-full px-4 py-2 mt-2 border text-gray-900 outline-none rounded-md" />
                    </div>
                    <div>
                        <label className="text-gray-500 dark:text-gray-200" for="description">Deskripcija</label>
                        <ReactQuill onChange={handleDescriptionChange} value={inputs.description} name="description" className='block mt-2 mb-12 h-36'/>
                    </div>
                    <FileInput name='imageUrl' onChange={handleFileChange} />
                    
                </div>

                <div className="flex justify-start mt-6">
                    <PrimaryButton content='Napravite uslugu' onClick={handleSubmit} primaryColor="black" secondaryColor="white" />
                </div>
                {err && <span className='text-red-500 block text-center bg-gray-200 py-4 mt-3'>{err}</span>}
            </form>
          </div>
        </div>
    </div>
  )
}

export default CreatePost