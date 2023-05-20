import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

dayjs.extend(relativeTime);

const Post = () => {
  const [post, setPost] = useState({});
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [price,  setPrice] = useState('')

  const params = useParams();
  const navigate = useNavigate()

  const { currentUser } = useContext(AuthContext);

  const proxy = 'http://localhost:5000/';

  const fetchPost = async () => {
    const response = await axios.get(`http://localhost:5000/api/posts/${params.id}`);
    console.log(response.data)
    setPost(response.data);
    setTitle(response.data.title);
    setDescription(response.data.description);
    setCity(response.data.city);
    setCategory(response.data.category)
    setPrice(response.data.price)
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/all/${params.id}`);
      console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async () => {
    try {
      if (post.workerId && post.workerId._id) {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/delete/${params.id}/worker/${post.workerId._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/posts'); // Redirect to home page after successful deletion
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchReviews();
  }, []);

  dayjs.locale({
    name: 'sr',
    relativeTime: {
      future: 'za %s',
      past: 'pre %s',
      s: 'nekoliko sekundi',
      m: '1 minut',
      mm: '%d minuta',
      h: '1 sat',
      hh: '%d sati',
      d: '1 dan',
      dd: '%d dana',
      M: '1 mesec',
      MM: '%d meseci',
      y: '1 godinu',
      yy: '%d godina'
    }
  });
  
  dayjs.locale('sr');

  const user = post.workerId && post.workerId.userId;
  const imageUrl = user && user.imageUrl;
  const firstName = user && user.firstName;
  const lastName = user && user.lastName;
  const createdAt = post.createdAt && dayjs(post.createdAt).fromNow();
  const userId = user && user._id;
  const workerId = post.workerId && post.workerId._id
  console.log('workerId', workerId)

  let averageStars = 0; 
  if (reviews.length > 0) {
    const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
    averageStars = totalStars / reviews.length;
  }

  return (
    <div>
      <img className='object-cover w-full lg:h-[60vh]' src={proxy + post.imageUrl} alt={post.imageUrl} />
      <div className='mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='flex flex-col lg:w-1/2 lg:gap-4'>
            <div className='flex justify-between items-center py-10'>
              <div className='flex gap-2'>
                <img className='w-12 h-12 rounded-full object-cover' src={proxy + imageUrl} alt='' />
                <div>
                  <p className='font-semibold'>{firstName + ' ' + lastName}</p>
                  <p className='text-sm font-medium'>{city}</p>
                  <p className='italic text-sm'>Postavljeno {createdAt}</p>
                </div>
              </div>
              <div>
                <p className='font-thin'>
                  {averageStars}<span className='text-orange-500'>/5</span>
                </p>
              </div>
            </div>
            <div>
            {currentUser && currentUser.userId === userId && (
              <div>
                <Link to={`/create-post/${workerId}?edit=${params.id}`} state={post} className='bg-green-500 px-4 py-2 text-white font-bold cursor-pointer'>
                  Azuriraj
                </Link>
                <Link onClick={deletePost} className='bg-red-500 px-4 py-2 text-white font-bold cursor-pointer'>
                  Obrisi
                </Link>
              </div>
            )}
          </div>
            <div className='flex flex-col gap-4 lg:gap-8'>
              <div className='px-4 py-2 mt-5 bg-indigo-500 self-start text-white font-bold'>{category}</div>
              <h1 className='text-2xl font-black lg:text-4xl'>{title}</h1>
              <p className='text-justify text-gray-800 text-xl font-thin' style={{ whiteSpace: 'pre-line' }}>
                {description}
              </p>
            </div>
            <div className='py-10'>
              <h2 className='text-lg font-bold'>Sta kazu ostali?</h2>
              { reviews.length > 0 ? <div className='flex flex-col gap-4 py-4'>
                {reviews?.map((review) => (
                  <div className='flex flex-col gap-4 p-4 shadow-lg mt-3'>
                    <div className='flex justify-between items-center'>
                      <div className='flex gap-2 items-center'>
                        <img className='w-8 h-8 rounded-full object-cover' src={proxy + review.userId.imageUrl} alt='' />
                        <div>
                          <p className='font-semibold'>{review.userId.firstName + ' ' + review.userId.lastName}</p>
                          <p className='italic text-sm'>Napisano {review.createdAt && dayjs(review.createdAt).fromNow()}</p>
                        </div>
                      </div>
                      <p className='font-thin'>{review.star}/<span className='text-orange-500'>5</span></p>
                    </div>
                      <p key={review._id} className='italic font-thin'>{review.reviewText}</p>
                  </div>
                ))}
              </div> : <p className='mt-5'>Niko jos nije ostavio recenziju {':('}</p>}
            </div>
          </div>
          <div className='flex flex-col gap-4 p-10 lg:sticky lg:border lg:border-gray-200 lg:shadow-lg lg:top-0 lg:h-full lg:w-1/2 lg:mx-auto text-center'>
            <h2 className='text-4xl'>CENOVNIK</h2>
            <p className='text-lg'>
              Ovaj majstor naplacuje <span className='font-bold'>{price}din</span> po satu
            </p>
            <button className='text-center px-4 text-white bg-orange-500 border rounded-xl sm:px-8 py-2 sm:hover:scale-105 sm:hover:bg-black sm:hover:text-white sm:duration-300 lg:self-center font-black'>
              Zaposli
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
