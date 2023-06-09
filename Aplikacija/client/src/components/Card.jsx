import React from 'react'

const Card = ({num, heading, desc}) => {
  return (
    
            <div className='flex flex-col relative gap-8 my-5 px-10 py-12 shadow-xl w-full 2xl:w-1/3 rounded-xl'>
                <span className='absolute top-[-25px] left-[-15px] text-5xl font-bold text-orange-400'>{num}</span>
                <h3 className='text-lg font-bold'>{heading}</h3>
                <p className='text-justify'>{desc}</p>
            </div>

  )
}

export default Card