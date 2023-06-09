import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import CategorySelection from '../components/CategorySelection';

const Posts = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [inputs, setInputs] = useState({
    city: '',
    category: '',
  });
  const [averageStars, setAverageStars] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const category = new URLSearchParams(location.search).get('cat');
    let url = 'http://localhost:5000/api/posts';

    if (category) {
      url += `?cat=${category}`;
    }

    try {
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [location.search]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setInputs((prev) => ({ ...prev, category: selectedCategory }));
  };

  const handleCitySelect = (selectedCity) => {
    setInputs((prev) => ({ ...prev, city: selectedCity }));
  };

  const handleSearch = async () => {
    const { city, category } = inputs;
    let url = 'http://localhost:5000/api/posts';

    if (city || category) {
      url += `?city=${city}&cat=${category}`;
    }

    try {
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };

  const fetchAverageStar = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/reviews/average/${postId}`,
        config
      );
      return response.data.average;
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [location.search, fetchPosts]);

  useEffect(() => {
    const fetchAverageStars = async () => {
      const averageStarPromises = posts.map((post) =>
        fetchAverageStar(post._id)
      );
      const averageStarValues = await Promise.all(averageStarPromises);
      const averageStarsMap = {};
      posts.forEach((post, index) => {
        averageStarsMap[post._id] = averageStarValues[index];
      });
      setAverageStars(averageStarsMap);
      setIsLoading(false); // Set loading state to false once data is fetched
    };

    setIsLoading(true); // Set loading state to true before fetching average stars
    fetchAverageStars();
  }, [posts]);

  const sortedPosts = [...posts].sort(
    (a, b) => averageStars[b._id] - averageStars[a._id]
  );

  return (
    <div className="py-[128px] min-h-screen">
      <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        <div className="flex flex-col gap-36">
          <div className="flex flex-col gap-8">
            <div className="mb-8">
              <div className="w-20 h-[2px] bg-black mb-5"></div>
              <h1 className="text-3xl font-black md:w-1/2 md:text-4xl lg:text-5xl lg:w-2/3 2xl:w-1/2 2xl:text-6xl">
                Usluge
              </h1>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <SearchBar onCitySelect={handleCitySelect} />
              <CategorySelection onChange={handleCategoryChange} />
              <button
                className="bg-orange-500 text-white px-8 py-2 rounded-md hover:bg-orange-600 duration-200"
                onClick={handleSearch}
              >
                Pretraži
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 md:gap-8 gap-16">
            {isLoading ? ( // Render a loading state while fetching data
              <p>Ucitavanje...</p>
            ) : sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
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
                    category={post.category}
                    averageStar={averageStars[post._id]}
                  />
                </div>
              ))
            ) : (
              <p>Jos nema dodatih usluga.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
