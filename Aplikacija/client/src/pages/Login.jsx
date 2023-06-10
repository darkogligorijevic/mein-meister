import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'


const Login = () => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  })

  const [err, setError] = useState(null)

  const { login, currentUser } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && inputs.email !== '' && inputs.password !== '') {
      navigate('/posts');
    }
  }, [currentUser, inputs, navigate]);

  const handleChange = (e) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate('/posts');
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  console.log(inputs)

  return (
    <div class="h-screen flex justify-center">
      <div class="flex lg:w-1/2 justify-center py-10 items-center bg-white">
        <form class="bg-white">
          <h1 class="text-gray-800 font-bold text-2xl lg:text-4xl mb-2">Prijava</h1>
          <p class="text-sm font-normal text-gray-600 mb-7">Popunite sledecu formu</p>
          <div className='flex justify-between gap-4'>
          </div>
              <div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input onChange={handleChange} class="pl-2 outline-none border-none w-full" name='email' type='email' placeholder='E-mail' />
          </div>
                <div class="flex items-center border-2 py-2 px-3 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd" />
                  </svg>
                  <input onChange={handleChange} class="pl-2 outline-none border-none w-full" name='password' type='password' placeholder='Lozinka' />
          </div>
                  <button onClick={handleSubmit} type="submit" class="block w-full bg-orange-500 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 hover:bg-black duration-300">Prijavi se</button>
                  <span class="text-sm ml-2">Nemate nalog? <Link className='font-semibold underline hover:text-gray-500 duration-200' to='/register'>Registrujte se.</Link></span>
                  {err && <p className='text-red-500 text-center max-w-[16rem] bg-gray-200 px-8 py-2 mt-2'>{err}</p>}
        </form>
      </div>
      <div className="relative overflow-hidden lg:flex w-1/2 justify-around items-center hidden">
        <video 
          src='https://player.vimeo.com/external/499523746.sd.mp4?s=273b076413d447e1471865809ea363976dc3f517&profile_id=165&oauth2_token_id=57447761' 
          className='absolute w-full h-full' 
          loop 
          muted 
          autoPlay 
          style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'brightness(50%)' }}
        />
        {/* <div className='flex flex-col gap-2'>
          <h1 className="text-white font-bold text-4xl font-sans">Pridruzite nam se</h1>
          <p className="text-white mt-1">Postanite deo naseg sveta.</p>
          <Link className="border self-start mt-2 border-white text-white px-8 py-2 rounded-xl hover:bg-white hover:text-black hover:scale-105 duration-300 font-black" to='/posts'>Vidite sve usluge</Link>
        </div> */}
      </div>
    </div>
  )
}

export default Login