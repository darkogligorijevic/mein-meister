import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Post = () => {

  const [post, setPost] = useState([])

  const params = useParams()

  console.log(params)

  const fetchPost = async () => {
    const response = await axios.get(`http://localhost:5000/api/posts/${params.id}`)
    console.log(response.data)
    setPost(response.data)
  }

  useEffect(() => {
    fetchPost()
  }, [])



  return (
    <div>
        <h1>{post.title}</h1>
    </div>
  )
}

export default Post