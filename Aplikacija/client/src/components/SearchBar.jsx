import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GEONAMES_API =
  'http://api.geonames.org/searchJSON?q=Serbia&country=RS&lang=sr&username=darkogligorijevic';

const SearchBar = ({ onCitySelect }) => {
  const [value, setValue] = useState('');
  const [cities, setCities] = useState([]);

  const location = useLocation();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const fetchGeonamesAPI = async () => {
    const response = await axios.get(GEONAMES_API);
    setCities(response.data.geonames);
  };

  useEffect(() => {
    fetchGeonamesAPI();
  }, []);

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    onCitySelect(searchTerm); // Pass the selected city to the callback function
  };

  if (location.pathname.startsWith('/create-post/') || location.pathname === '/posts') {
    return (
      <div className='flex flex-col gap-4 max-h-[70px]'>
          <div className='flex flex-col gap-4 relative lg:flex-row'>
            <div className='flex gap-2 lg:w-full'>
              <input type='search' placeholder='npr. Beograd'
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md outline-none"
              value={value}
              onChange={onChange}
              />
              <div className='absolute top-16 left-0 right-0'>
                {cities.filter(city => {
                    const searchTerm = value.toLowerCase()
                    const cityName = city.name.toLowerCase()
                    return searchTerm && cityName.startsWith(searchTerm) && cityName !== searchTerm
                }).slice(0, 5)
                .map(city => (
                    <ul className='bg-white text-gray-900'>
                        <li key={city.geonameId} className='px-8 py-2 cursor-pointer hover:bg-gray-100' onClick={() => onSearch(city.name)}>{city.name}</li>
                    </ul>
                ))}
              </div>
            </div>  
          </div>
  
      </div>
    )
  } else {
    return (
      <div className='max-h-[70vh]'>
          <div className='flex relative borderrounded-xl border-gray-200'>
              <input type='search' placeholder='npr. Beograd'
              className='px-4 py-2 text-black outline-none'
              value={value}
              onChange={onChange}
              />
          </div>
          <div>
              {cities.filter(city => {
                  const searchTerm = value.toLowerCase()
                  const cityName = city.name.toLowerCase()
                  return searchTerm && cityName.startsWith(searchTerm) && cityName !== searchTerm
              }).slice(0, 5)
              .map(city => (
                  <ul className='bg-white text-gray-900 md:w-1/2'>
                      <li key={city.geonameId} className='px-8 py-2 cursor-pointer hover:bg-gray-100' onClick={() => onSearch(city.name)}>{city.name}</li>
                  </ul>
              ))}
          </div>
      </div>
    )
  } 

}

export default SearchBar