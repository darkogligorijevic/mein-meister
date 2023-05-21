import React from 'react';
import { useNavigate } from 'react-router-dom';
import TruncatedText from './TruncatedText';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const PostCard = ({
  id,
  title,
  description,
  city,
  postImage,
  profileImage,
  firstName,
  lastName,
}) => {
  const navigate = useNavigate();

  const proxy = 'http://localhost:5000/';

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className='shadow-xl h-full flex flex-col'>
      <div className='relative flex-grow'>
        <LazyLoadImage
          effect='blur'
          className='object-cover w-full h-64'
          src={proxy + postImage}
          alt={'post' + id}
        />
      </div>
      <div className='px-4 2xl:px-8 py-10 flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-8 w-full'>
            <div className='flex justify-between items-center'>
              <div className='flex gap-4 items-center'>
                <img
                  className='w-12 h-12 rounded-full object-cover'
                  src={proxy + profileImage}
                  alt={'profile' + id}
                />
                <div>
                  <p>{firstName + ' ' + lastName}</p>
                  <p className='font-semibold'>{city}</p>
                </div>
              </div>
              <p>
                4<span className='text-orange-500'>/5</span>
              </p>
            </div>
            <h2 className='text-lg font-bold'>{title}</h2>
          </div>
        </div>
        <TruncatedText text={description} maxLength={80} location={`/post/${id}`} />
        <button
          onClick={handleClick}
          className='bg-orange-500 text-white px-8 py-2 mt-5 cursor-pointer hover:bg-orange-600 duration-300'
        >
          Pogledaj vise
        </button>
      </div>
    </div>
  );
};

export default PostCard;
