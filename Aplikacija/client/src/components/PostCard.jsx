import React from 'react';
import { useNavigate } from 'react-router-dom';
import TruncatedText from './TruncatedText';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PrimaryButton from './PrimaryButton';

const PostCard = ({
  id,
  title,
  description,
  city,
  postImage,
  profileImage,
  firstName,
  lastName,
  category,
  averageStar,
}) => {
  const navigate = useNavigate();

  const proxy = 'http://localhost:5000/';

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className='shadow-xl h-full flex flex-col relative pb-2'>
      <LazyLoadImage
        effect='blur'
        className='object-cover w-full h-64'
        src={proxy + postImage}
        alt={'post' + id}
      />
      <div className='flex flex-col gap-8 p-8 h-full justify-between'>
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
          {averageStar ? (
            <p>
              {averageStar} / <span className='text-orange-500'>5</span>
            </p>
          ) : (
            <p>N/A</p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>{title}</h2>
          {/* Use parse() from html-react-parser to parse and render the formatted description */}
          {/*<div className="formatted-description">{parse(description)}</div>*/}
          <TruncatedText text={description} maxLength={40} location={`/post/${id}`} />
        </div>
        <div>
          <PrimaryButton
            content='Pogledaj vise'
            onClick={handleClick}
            adjustments={
              'bg-transparent text-orange-500 hover:border-orange-500 hover:text-white duration-300 hover:bg-orange-500'
            }
          />
        </div>
      </div>
      <div className='absolute top-0 left-0 px-4 py-2 bg-gray-900 font-bold text-white'>
        {category}
      </div>
    </div>
  );
};

export default PostCard;
