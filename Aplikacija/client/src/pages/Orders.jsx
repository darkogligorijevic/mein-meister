import React from 'react'
import Order from '../components/Order'

const Orders = () => {
  return (
    <div className='py-[128px]'>
        <div className='mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]'>
            <div className='flex flex-col gap-12'>
                <div>
                    <div className="w-20 h-[2px] bg-gray-400 mb-5"></div>
                    <h1 className="text-3xl font-black md:w-1/2 md:text-4xl lg:text-5xl lg:w-2/3 2xl:w-1/2 2xl:text-6xl">Obavestenja</h1>
                </div>
                <div>
                    <Order 
                        
                    />
                </div>
            </div>
        </div>
    </div>

  )
}

export default Orders