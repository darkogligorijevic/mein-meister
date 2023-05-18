import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
import CategorySelection from '../components/CategorySelection'

const Posts = () => {

 const [posts, setPosts] = useState([])
 const [inputs, setInputs] = useState({
    city: '',
    category: ''
  });

 const fetchPosts = async () => {
    const response = await axios.get("http://localhost:5000/api/posts/")
    console.log(response.data)
    setPosts(response.data)
 }

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setInputs((prev) => ({ ...prev, category: selectedCategory }));
  };

  const handleCitySelect = (selectedCity) => {
    setInputs((prev) => ({ ...prev, city: selectedCity }));
  };

  
  useEffect(() => {
      fetchPosts()
    }, [])

    console.log(inputs);
    
  return (
    <div className="py-[128px]">
        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
            <div className='flex flex-col gap-36'>
                <div className='flex flex-col gap-8'>
                    <div>
                        <div className="w-20 h-[2px] bg-black mb-5"></div>
                        <h1 className="text-3xl font-black md:w-1/2 md:text-4xl lg:text-5xl lg:w-2/3 2xl:w-1/2 2xl:text-6xl">Usluge</h1>
                    </div>
                    <div className='flex flex-col gap-4 md:flex-row'>
                        <SearchBar onCitySelect={handleCitySelect} /> {/* here we are selecting city */}
                        <CategorySelection onChange={handleCategoryChange}/> {/* here we are selecting category */}
                        <button className='bg-orange-500 text-white px-8 py-2 rounded-md'>Pretraži</button> {/* on click i want to filter posts which are down */}
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 md:gap-8 gap-16'>
                {
                    posts?.map(post => (  
                        <div key={post._id}>
                            <PostCard 
                                title={post.title} 
                                postImage={post.imageUrl} 
                                description={post.description}
                                city={post.city} 
                                id={post._id}
                                profileImage={post.workerId.userId.imageUrl}
                                firstName={post.workerId.userId.firstName}
                                lastName={post.workerId.userId.lastName}
                            />
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Posts