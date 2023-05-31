import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import TruncatedText from '../components/TruncatedText';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
  const [worker, setWorker] = useState([]);
  const [posts, setPosts] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const proxy = 'http://localhost:5000/';

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete('http://localhost:5000/api/auth/delete', config);
      toast.success(response.data.message)
      logout();
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/posts/delete/${postId}/worker/${worker._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message)
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchWorker = async () => {
      const response = await axios.get(`${proxy}api/workers/userId/${currentUser.userId}`);
      setWorker(response.data);
    };
    const fetchAllPostsByWorkerId = async () => {
      const response = await axios.get(`${proxy}api/posts/worker/${worker._id}`);
      console.log(response.data);
      setPosts(response.data);
    };
    fetchWorker();
    fetchAllPostsByWorkerId();
  }, [currentUser.userId, worker._id]);

  return (
    <div className='py-[128px] min-h-screen'>
      <div className='mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]'>
        <div className='flex flex-col md:flex-row gap-4'>
          <img
            className='md:rounded-full h-full w-full md:h-40 md:w-40 object-cover'
            src={proxy + currentUser.image}
            alt=''
          />
          <div className='flex flex-col gap-2 justify-evenly'>
            <h1 className='text-3xl font-bold'>{currentUser.firstName + ' ' + currentUser.lastName}</h1>
            <p className='text-xl font-semibold'>{currentUser.email}</p>
            {currentUser.isMeister ? (
              <p className='text-lg font-medium'>
                Uloga: <span className='text-orange-500'>Majstor</span>
              </p>
            ) : (
              <p className='text-lg font-medium'>
                Uloga: <span className='text-orange-500'>Korisnik</span>
              </p>
            )}
          </div>
        </div>
        {posts?.map((post) => (
          <div className='flex flex-col md:flex-row md:mt-32 gap-4 shadow-lg mt-16 odd:flex-row-reverse' key={post._id}>
            <img className='md:w-1/2' src={proxy + post.imageUrl} alt='' />
            <div className='flex flex-col md:justify-center gap-6 px-6 py-4'>
              <div className='flex items-center gap-8'>
                <h2 className='text-lg font-bold md:text-3xl md:font-black'>{post.title}</h2>
                <div className='flex gap-4'>
                <Link
                  to={`/create-post/${worker._id}?edit=${post._id}`}
                  state={post}
                  className='hover:text-green-500 duration-300'
                >
                  <EditIcon />
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeletePost(post._id); // Call the delete function passing the post ID
                  }}
                  className='hover:text-red-500 duration-300'
                >
                  <DeleteIcon />
                </Link>
              </div>

              </div>
              <p className='font-medium text-xl'>{post.city}</p>
              <TruncatedText text={post.description} maxLength={40} location={`/post/${post._id}`} />
            </div>
          </div>
        ))}
        <div className='mt-16 flex flex-col md:flex-row gap-16'>
          <Link to={`/register?edit=${currentUser.userId}`} state={currentUser} className='hover:text-green-500 duration-300  flex gap-1 items-center'>
            <EditIcon /> Ažuriraj profil
          </Link>
          <Link onClick={handleDeleteUser} className='hover:text-red-500 duration-300  flex gap-1 items-center'>
            <DeleteIcon /> Obriši profil
          </Link>
          <Link to={`/change-password`} state={currentUser} className='hover:text-orange-500 duration-300 flex gap-1 items-center'>
            <KeyIcon /> Izmenite lozinku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
