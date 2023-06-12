import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);

const Post = () => {
  const [orders, setOrders] = useState([])
  const [post, setPost] = useState({});
  const [isDeleteClicked, setIsDeleteClicked] = useState(false)
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [price,  setPrice] = useState('')
  const [hireInfo, setHireInfo] = useState('');

  const params = useParams();
  const navigate = useNavigate()

  const { currentUser } = useContext(AuthContext);

  const proxy = 'http://localhost:5000/';

  const deletePost = async () => {
    try {
      if (post.workerId && post.workerId._id) {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/delete/${params.id}/worker/${post.workerId._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/posts');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    const fetchPost = async () => {
      const response = await axios.get(`http://localhost:5000/api/posts/${params.id}`);
      setPost(response.data);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setCity(response.data.city);
      setCategory(response.data.category)
      setPrice(response.data.price)
      setHireInfo(response.data.hireInfo)
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/all/${params.id}`);
        console.log(response.data)
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
    fetchReviews();
  }, [params.id]);

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

  let averageStars = 0; 
  if (reviews.length > 0) {
    const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
    averageStars = totalStars / reviews.length;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`http://localhost:5000/api/orders/worker/${workerId}`, config)
        console.log(response.data)
        setOrders(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrders()
  }, [workerId])

  console.log(orders)

  let responseTime = 0
  let acceptedOrdersCount = 0
  let totalResponseTime = 0
  orders.forEach((order) => {
    if (order.isAccepted) {
      const createdTime = new Date(order.createdAt).getMinutes()
      const updatedTime = new Date(order.updatedAt).getMinutes()
      console.log(createdTime)
      responseTime = Math.abs(updatedTime - createdTime)
      totalResponseTime += responseTime
      acceptedOrdersCount++
    }
  })
  
  const averageResponseTime = totalResponseTime / acceptedOrdersCount



  const confirmDeleteProfile = () => {
    setIsDeleteClicked(!isDeleteClicked)
  }

  const isEdited = (review) => {
    const created = new Date(review.createdAt);
    const edited = new Date(review.updatedAt);
    
    return created.getTime() !== edited.getTime();
  };

  const deleteReview = async (review) => {
    try {

      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      await axios.delete(`http://localhost:5000/api/reviews/${review}`, 
        config
      ).then((response) => {
        toast.success(response.data.message)
        window.location.reload();
      }).catch((err) => {
        toast.error(err.response.data.message)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='relative'>
      <img className='object-cover w-full 2xl:h-[60vh] sm:h-[40vh]' src={proxy + post.imageUrl} alt={post.imageUrl} />
      <div className='mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]'>
        <div className='flex flex-col 2xl:flex-row gap-4'>
          <div className='flex flex-col 2xl:w-1/2 lg:gap-4'>
            <div className='flex justify-between items-center py-10'>
              <div className='flex gap-2'>
                <img className='w-12 h-12 rounded-full object-cover' src={proxy + imageUrl} alt='' />
                <div>
                  <p className='font-bold'>{firstName + ' ' + lastName}</p>
                  <p className='text-sm font-medium'>{city}</p>
                  <p className='italic text-sm'>Postavljeno {createdAt}</p>
                </div>
              </div>
              <div>
              {averageStars > 0 ? (
                <div className='flex items-center'>
                  <div className='text-orange-500 items-center'>
                    <StarIcon fontSize='16px'/>
                  </div>
                  <p className='font-bold'>
                    {averageStars}/5
                  </p>
                </div>
              ) : (
                <p className='font-thin'>N/A</p>
              )}
            </div>
            </div>
            <div>
            {currentUser && currentUser.userId === userId && (
              <div className='flex gap-4'>
                <Link to={`/create-post/${workerId}?edit=${params.id}`} state={post} className='hover:text-green-500 duration-300'>
                  <EditIcon />
                </Link>
                <Link onClick={confirmDeleteProfile} className='hover:text-red-500 duration-300'>
                  <DeleteIcon />
                </Link>
              </div>
            )}

            {currentUser && currentUser.isAdministrator && (
              <div className='flex gap-4'>
                <Link to={`/create-post/${workerId}?edit=${params.id}`} state={post} className='hover:text-green-500 duration-300'>
                  <EditIcon />
                </Link>
                <Link onClick={confirmDeleteProfile} className='hover:text-red-500 duration-300'>
                  <DeleteIcon />
                </Link>
              </div>
            )}
          </div>
            <div className='flex flex-col gap-4 lg:gap-8'>
              <div className='px-4 py-2 mt-5 bg-orange-500 self-start text-white font-bold'>{category}</div>
              <h1 className='text-2xl font-black lg:text-4xl'>{title}</h1>
              <div dangerouslySetInnerHTML={{__html: description}} />
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
                          { isEdited(review) ? <p className='italic text-sm'>Editovano {review.updatedAt && dayjs(review.updatedAt).fromNow()}</p> : <p className='italic text-sm'>Napisano {review.createdAt && dayjs(review.createdAt).fromNow()}</p>}
                        </div>
                        <div>
                        { currentUser.userId === review.userId._id &&
                          <div className='flex gap-4 '>
                        <Link to={`/create-review/${params.id}?edit=${review._id}`} state={review} className='hover:text-green-500 duration-300'>
                          <EditIcon style={{fontSize: '0.8rem'}} />
                        </Link>
                        <Link onClick={() => deleteReview(review._id)} className='hover:text-red-500 duration-300'>
                          <DeleteIcon style={{fontSize: '0.8rem'}} />
                        </Link>
                      </div>}
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
          <div className='flex flex-col gap-8 p-10 lg:sticky border border-gray-200 rounded-3xl shadow-lg lg:top-0 2xl:h-full 2xl:w-1/3 2xl:mx-auto text-center'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl'>Cena</h2>
              { price > 0 ? <p className='text-lg'>
              <p className='font-bold text-4xl'>RSD{price}</p>
              </p> : <p className='text-lg'>
              Po dogovoru
              </p>}
            </div>
            <p className='text-start font-thin'>
              {hireInfo}
            </p>
            { averageResponseTime ?
              <div className='flex items-center gap-4'>
              <AccessTimeIcon />
              <p className='text-start'>{`Ovaj majstor odgovara u roku od ${averageResponseTime} minuta`}</p>
            </div> : null}
            
            { currentUser && currentUser.userId !== userId && ( <Link to={`/create-order/${params.id}`} className='text-center px-4 text-white bg-orange-500 border rounded-xl sm:px-8 py-2 sm:hover:scale-105 sm:hover:bg-black sm:hover:text-white sm:duration-300  font-black'>
              Zaposli
            </Link>)}
          </div>
        </div>
      </div>
      { isDeleteClicked ?        
        <div className='fixed left-0 right-0 bottom-[20%] lg:left-[25%] md:bottom-[30%] lg:right-[25%]'>
            <div className='fixed bg-black opacity-75 w-full h-full top-0 left-0 right-0'></div>
            <div className='flex relative flex-col gap-8 items-center p-40 z-[1]'>
              <div className='absolute top-0 w-full h-full bg-gray-900 z-[-1] blur-md rounded-2xl'></div>
              <span className='2xl:text-4xl text-xl text-center font-black text-white'>Da li ste sigurni da zelite da izbrisete svoju uslugu?</span>            
              <div className='flex gap-4 flex-col md:flex-row lg:gap-16'>
                  <button onClick={deletePost} className='px-16 py-2 rounded-md bg-green-500 font-black text-white'>Da</button>
                  <button onClick={confirmDeleteProfile} className='px-16 py-2 rounded-md bg-red-500 font-black text-white'>Ne</button>
              </div>
            </div>
        </div> : null}
    </div>
  );
};

export default Post;
