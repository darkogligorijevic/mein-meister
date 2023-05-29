import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import FileInput from '../components/FileInput';

const Register = () => {
  const state = useLocation().state
  const [inputs, setInputs] = useState({
    firstName: state?.firstName || '',
    lastName: state?.lastName || '',
    email: state?.email || '',
    password: state?.password || '',
    imageUrl: state?.imageUrl || null,
  });

  const {currentUser} = useContext(AuthContext)

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentUser) {
  //     navigate("/posts");
  //   }
  // }, [currentUser, navigate]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (acceptedFiles) => {
    setInputs((prev) => ({ ...prev, imageUrl: acceptedFiles[0] }));
  };

  const [err, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', inputs.firstName);
    formData.append('lastName', inputs.lastName);
    formData.append('email', inputs.email);
    formData.append('password', inputs.password);
    formData.append('imageUrl', inputs.imageUrl);

    try {
      const token = localStorage.getItem('token')
      state ? 
      await axios.patch(`http://localhost:5000/api/auth/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        console.log(response.data)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/posts')
      }).catch((error) => {
        console.log(error)
        setError(error.response.data.message);
      })

      :
      
      await axios.post('http://localhost:5000/api/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response.data);
          navigate('/login');
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message);
        });
    } catch (err) {
      console.log(err)
    }
  };

  console.log(inputs);

  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-orange-500 to-orange-700 justify-around items-center hidden"
        >
        <div className='flex flex-col gap-2'>
          <h1 className="text-white font-bold text-4xl font-sans">Pridruzite nam se</h1>
          <p className="text-white mt-1">Postanite deo naseg sveta.</p>
          <Link className="border self-start mt-2 border-white text-white px-8 py-2 rounded-xl hover:bg-white hover:text-black hover:scale-105 duration-300 font-black" to='/posts'>Vidite sve usluge</Link>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white">
          <h1 className="text-gray-800 font-bold text-2xl lg:text-4xl mb-2">{ !state ? 'Registracija' : 'Azuriraj profil'}</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Popunite sledecu formu</p>
          <div className='flex justify-between gap-4'>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd" />
              </svg>
              <input value={inputs.firstName} onChange={handleChange} className="pl-2 outline-none border-none" type="text" name='firstName' placeholder='Ime' />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              <input value={inputs.lastName} onChange={handleChange} className="pl-2 outline-none border-none" type="text" name='lastName' placeholder='Prezime' />
          </div>
          </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input value={inputs.email} onChange={handleChange} className="pl-2 outline-none w-full border-none" name='email' type='email' placeholder='E-mail' />
          </div>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd" />
                  </svg>
                  <input onChange={handleChange} className="pl-2 outline-none w-full border-none" name='password' type='password' placeholder='Lozinka' />
          </div>
                  <FileInput name='imageUrl' onChange={handleFileChange}/>
                  <button onClick={handleSubmit} type="submit" class="block w-full bg-orange-500 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">{ !state ? 'Pridruzite nam se' : 'Azuriraj'}</button>
                  { !state ? <span className="text-sm ml-2">Vec imate nalog? <Link className='font-semibold underline hover:text-gray-500 duration-200' to='/login'>Prijavite se.</Link></span> : null}
                  {err && <span className='text-red-500 block text-center bg-gray-200 py-4 mt-2'>{err}</span>}
        </form>
      </div>
    </div>
  )
}

export default Register