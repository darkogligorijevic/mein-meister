import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import PlumbingIcon from '@mui/icons-material/Plumbing';

const Navbar = () => {
  const [burger, setBurger] = useState(false);
  const [worker, setWorker] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchWorkerId = async () => {
      try {
        const response = await axios.get(`${proxy}api/workers/userId/${currentUser.userId}`);
        setWorker(response.data._id);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorkerId();
  }, [currentUser]);

  const openBurger = () => {
    setBurger(!burger);
  };

  const openDropDown = () => {
    setDropDown(true);
  }

  const closeDropDown = () => {
    setDropDown(false);
  }

  const proxy = "http://localhost:5000/";

  if (location.pathname === '/') {

      return (
        <div className="py-5 absolute top-0 left-0 right-0 z-50">
            <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                <div className="flex justify-between items-center text-white">
                    
                    <div className="flex items-center">
                        <PlumbingIcon />
                        { currentUser ? <Link to='/posts' className="text-xl font-black">Mein<span className="text-orange-500">Meister</span></Link> : <Link to='/' className="text-xl font-black">Mein<span className="text-orange-500">Meister</span></Link>}
                    </div>
                    { currentUser ?    
                    <div className="flex gap-8 items-center w-1/2 justify-end">
                        { currentUser.isMeister ? <Link to={`/create-post/${worker}`} className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300">Napravite uslugu</Link>  : <Link className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300" to='/become-a-meister'>Postanite majstor</Link> }
                        <Link className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                        <div className="flex items-center md:gap-2 hover:scale-95 duration-300 cursor-pointer">                    
                            <img className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" src={proxy + currentUser.image} alt={currentUser.userId} />
                            <span className="hidden md:block">{currentUser.firstName}</span>
                        </div> 
                        <Link onClick={logout} to='/' className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300 cursor-pointer">Odjavite se</Link>
                    </div>  
                     
                        :
                        <div className="hidden md:block items-center gap-4">
                            <div className="items-center flex gap-8">
                                <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                                <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/login'>Prijavite se</Link>
                                <Link className="border border-white px-8 py-2 rounded-xl hover:bg-white hover:text-black hover:scale-105 duration-300 font-black" to='/register'>Pridružite nam se</Link>
                            </div>
                        </div> 
                        }
                    <div className="md:hidden">
                        <svg onClick={openBurger} className="w-[20px] cursor-pointer"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> </g></svg>
                    </div>
                    {burger ?
                    <div className="absolute top-16 left-0 right-0 bg-orange-500 block md:hidden z-50">
                        { currentUser ? 
                        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                            <div className="flex flex-col py-8 gap-8 text-center"> 
                            { currentUser.isMeister ? <Link to={`/create-post/${worker}`} className="hover:text-gray-300 hover:scale-105 duration-300">Napravite uslugu</Link>  : <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/become-a-meister'>Postanite majstor</Link> }
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                            <Link onClick={logout} to='/' className="hover:text-gray-300 hover:scale-105 duration-300 cursor-pointer">Odjavite se</Link>
                            </div>
                        </div>
                        : 
                        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                            <div className="flex flex-col py-8 gap-8 text-center"> 
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/login'>Prijavite se</Link>
                            <Link className="border border-white px-8 py-2 rounded-xl hover:bg-white hover:text-black hover:scale-105 duration-300 font-black" to='/register'>Pridružite nam se</Link>
                            </div>
                        </div>
                        }
                    </div> 
                    : 
                    <div className="hidden">
                    
                    </div>}
                </div>
            </div>
        </div>
      )
  } else {
    return (
        <div className="py-5">
            <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                <div className="flex justify-between items-center text-black">
                    <div className="flex items-center">
                    <PlumbingIcon />
                    { currentUser ? <Link to='/posts' className="text-xl font-black">Mein<span className="text-orange-500">Meister</span></Link> : <Link to='/' className="text-xl font-black">Mein<span className="text-orange-500">Meister</span></Link>}
                    </div>
                    { currentUser ?    
                    <div className="flex gap-8 items-center w-1/2 justify-end">
                        { currentUser.isMeister ? <Link to={`/create-post/${worker}`} className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300">Napravite uslugu</Link>  : <Link className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300" to='/become-a-meister'>Postanite majstor</Link> }
                        <Link className="hidden md:block hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                        <div onMouseEnter={openDropDown} onMouseLeave={closeDropDown} onClick={openDropDown} className="relative flex items-center md:gap-2 duration-300 cursor-pointer rounded-full bg-gray-200 py-2 px-4">                    
                            <img className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" src={proxy + currentUser.image} alt={currentUser.userId} />
                            <span className="hidden md:block">{currentUser.firstName}</span>
                            { dropDown ? 
                                <div className="flex flex-col z-50 absolute md:top-16 top-14 text-center bg-white text-gray-600 right-0 left-0">
                                    <Link to='/orders' className="py-2 w-full border-b border-gray-100 hover:bg-gray-100 duration-200">Obavestenja</Link>
                                    <Link to={`/profile`} className="py-2 w-full border-b border-gray-100 hover:bg-gray-100 duration-200">Moj profil</Link>
                                    <Link onClick={logout} to='/' className="py-2 w-full border-b border-gray-100 hover:bg-gray-100 duration-200">Odjavi se</Link >
                                </div> : null} 
                        </div>
                    </div>  
                     
                     :
                     <div className="hidden md:block items-center gap-4">
                            <div className="items-center flex gap-8">
                                <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                                <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/login'>Prijavite se</Link>
                                <Link className="border border-black px-8 py-2 text-black rounded-xl hover:bg-black hover:text-white hover:scale-105 duration-300 font-black" to='/register'>Pridružite nam se</Link>
                            </div>
                        </div> 
                        }
                    <div className="md:hidden">
                        <svg onClick={openBurger} className="w-[20px] cursor-pointer"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> </g></svg>
                    </div>
                    {burger ?
                    <div className="absolute top-20 left-0 right-0 bg-orange-500 block md:hidden text-white z-50">
                        { currentUser ? 
                        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                            <div className="flex flex-col py-8 gap-8 text-center"> 
                            { currentUser.isMeister ? <Link to={`/create-post/${worker}`} className="hover:text-gray-300 hover:scale-105 duration-300">Napravite uslugu</Link>  : <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/become-a-meister'>Postanite majstor</Link> }
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link>
                            <Link onClick={logout} to='/' className="hover:text-gray-300 hover:scale-105 duration-300 cursor-pointer">Odjavite se</Link>
                            </div>
                        </div>
                        : 
                        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                            <div className="flex flex-col py-8 gap-8 text-center">
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/posts'>Usluge</Link> 
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/login'>Prijavite se</Link>
                            <Link className="border border-white px-8 py-2 text-white rounded-xl hover:bg-black hover:border-black hover:text-white hover:scale-105 duration-300 font-black" to='/register'>Pridružite nam se</Link>
                            </div>
                        </div>
                        }
                    </div> 
                    : 
                    <div className="hidden">
                    
                    </div>}
                </div>
            </div>
        </div>
      )
  }

}

export default Navbar