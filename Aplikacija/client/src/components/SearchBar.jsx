import cities from '../data/cities.json'
import { useState } from 'react'

const SearchBar = () => {

  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onSearch = (searchTerm) => {
    console.log('search', searchTerm)
    setValue(searchTerm)
  }

  return (
    <form className='flex flex-col gap-4 max-h-[70px]'>
        <div className='flex relative mt-5'>
            <div className='absolute right-1/4 sm:hidden h-full w-20 bg-gradient-to-r from-transparent to-gray-400'></div>
            <input type='search' placeholder='npr. Beograd'
            className='px-8 py-4 rounded-3xl text-black outline-none w-full md:w-1/2 2xl:w-1/3'
            value={value}
            onChange={onChange}
            />
            <button className='px-8 py-4 absolute right-0 md:hover:bg-orange-600 duration-300 md:right-1/2 xl:right-1/2 2xl:right-2/3 bg-orange-500 rounded-3xl' onClick={() => onSearch(value)}>Pretrazi</button>
        </div>
        <div>
            {cities.filter(city => {
                const searchTerm = value.toLowerCase()
                const cityName = city.city.toLowerCase()
                return searchTerm && cityName.startsWith(searchTerm) && cityName !== searchTerm
            }).slice(0, 5)
            .map(city => (
                <ul className='bg-white text-gray-900 md:w-1/2 xl:w-1/3'>
                    <li key={city.zip} className='px-8 py-2 cursor-pointer hover:bg-gray-100' onClick={() => onSearch(city.city + ', ' + city.region)}>{city.city}, {city.region}</li>
                </ul>
            ))}
        </div>

    </form>
  )
}

export default SearchBar