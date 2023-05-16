import React from 'react'
import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/authContext';


const Post = () => {

  const [post, setPost] = useState([])

  const params = useParams()

  const { currentUser } = useContext(AuthContext)
  
  console.log(params)
  
  const proxy = "http://localhost:5000/"
  
  const fetchPost = async () => {
    const response = await axios.get(`http://localhost:5000/api/posts/${params.id}`)
    console.log(response.data)
    setPost(response.data)
  }
  
  useEffect(() => {
    fetchPost()
  }, [])
  
  console.log(post.workerId.userId.imageUrl)


  return (
    <div>
        <img className='object-cover w-full lg:h-[60vh]' src={proxy + post.imageUrl} alt={post.imageUrl} />
        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
          <div className='flex justify-between items-center py-10'>
            <div className='flex gap-2'>
              <img className='w-12 h-12 rounded-full object-cover' src={proxy + currentUser.image} alt={currentUser.image} />
              <div>
                <p className='font-semibold'>{currentUser.firstName + " " + currentUser.lastName}</p>
                <p className='text-sm font-medium'>{post.city}</p>
                <p className='italic text-sm'>Posted 2 days ago</p>
              </div>
            </div>
            <div>
              <p>4<span className='text-orange-500'>/5</span></p>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h1 className='text-xl font-black'>{post.title}</h1>
            <p className='text-justify'>{post.description}</p>
          </div>
          <div className='py-10'>
            <h2 className='text-lg font-bold'>Sta kazu ostali?</h2>
            <div className='flex flex-col gap-4 py-4'>
              <p>Review1</p>
              <p>Review2</p>
              <p>Review3</p>
            </div>
          </div>
          <button className="text-center px-4 text-white bg-orange-500 border rounded-xl sm:self-start sm:px-8 py-2 sm:hover:scale-105 sm:hover:bg-black sm:hover:text-white sm:duration-300 lg:self-start font-black">Zaposli</button>
        </div>
    </div>

  )
}

export default Post