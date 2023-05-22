import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser'; // Import the library

const TruncatedText = ({ text, maxLength, location }) => {
  const [truncated, setTruncated] = useState(true);

  const toggleTruncate = () => {
    setTruncated(!truncated);
  };

  const truncatedText = truncated ? text.slice(0, maxLength) + '...' : text;

  return (
    <div>
      <div className='formatted-description'>{parse(truncatedText)}</div>
      <button onClick={toggleTruncate}>
        {truncated ? <Link to={location} className='text-orange-500 hover:text-gray-300 duration-300 text-sm'>Procitajte vise {'>'}</Link> : null}
      </button>
    </div>
  );
};

export default TruncatedText;