import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className="flex flex-col justify-center relative h-screen py-[128px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80')" }}>
    <div className="absolute inset-0 bg-black opacity-60"></div>
    <div className="flex justify-center absolute right-0 left-0 mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
      <div className='flex flex-col gap-8 w-full sm:w-2/3 md:w-1/2 2xl:w-1/3 rounded-3xl bg-orange-500 px-8 py-16'>
        <h1 className='text-white text-4xl font-black self-center'>Registracija</h1>
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4'>
            <input className='px-8 py-2 rounded-xl outline-none' name='first_name' type='text' placeholder='Ime' />
            <input className='px-8 py-2 rounded-xl outline-none' name='last_name' type='text' placeholder='Prezime' />
          </div>
          <input className='px-8 py-2 rounded-xl outline-none' name='email' type='email' placeholder='E-mail' />
          <input className='px-8 py-2 rounded-xl outline-none' name='password' type='password' placeholder='Lozinka' />
          <input name='image' type='file' placeholder='Lozinka' />
          <button className="text-white px-4 py-2 bg-transparent border border-white hover:border-white rounded-xl sm:px-8 sm:hover:scale-105 sm:hover:bg-white sm:hover:text-black sm:duration-300 mt-4 font-black">Pridružite nam se</button>
          <p className='text-white self-center mt-5'>Imate vec nalog? <Link className='font-semibold underline hover:text-gray-200 duration-200' to='/login'>Prijavite se.</Link></p>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Register