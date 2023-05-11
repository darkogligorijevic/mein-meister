import { Link, } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'


const Login = () => {

  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  })

  const [err, setError] = useState(null)

  const handleChange = (e) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", inputs)
      const token = response.data.token
      localStorage.setItem('token', token)
    } catch (err) {
      console.log(err)
      setError(err.response.data.message)
    }

  }

  console.log(inputs)

  return (
    <div className="flex flex-col justify-center relative h-screen py-[128px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614213951697-a45781262acf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')" }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="flex justify-center absolute right-0 left-0 mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        <div className='flex flex-col gap-8 w-full sm:w-2/3 md:w-1/2 2xl:w-1/3 rounded-3xl bg-orange-500 px-8 py-16'>
          <h1 className='text-white text-4xl font-black self-center'>Prijava</h1>
          <form className='flex flex-col gap-4'>
            <input onChange={handleChange} className='px-8 py-2 rounded-xl outline-none' name='email' type='email' placeholder='E-mail' />
            <input onChange={handleChange} className='px-8 py-2 rounded-xl outline-none' name='password' type='password' placeholder='Lozinka' />
            <button onClick={handleSubmit} type="submit" className="text-white px-4 py-2 bg-transparent border border-white hover:border-white rounded-xl sm:px-8 sm:hover:scale-105 sm:hover:bg-white sm:hover:text-black sm:duration-300 mt-4 font-black">Prijavite se</button>
            {err && 
            <div className='px-4 py-2 bg-white mt-2'>
              <p className='text-red-500 self-center'>{err}</p>
            </div>
            }

            <p className='text-white text-center mt-5'>Nemate nalog? <Link className='font-semibold underline hover:text-gray-200 duration-200' to='/register'>Napravite nalog.</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login