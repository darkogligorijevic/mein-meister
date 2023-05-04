import { Link } from "react-router-dom"
import { useState } from "react"

const Navbar = () => {
  const [burger, setBurger] = useState(false)

  const openBurger = () => {
    setBurger(!burger)
  }
 
  return (
    <div className="py-5 absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
            <div className="flex justify-between items-center text-white">
                <div>
                    <Link to='/' className="text-xl font-black">Mein<span className="text-orange-500">Meister</span></Link>
                </div>
                <div className="space-x-8 md:gap-8 md:items-center font-semibold hidden md:block">
                    <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/become-a-meister'>Postanite majstor</Link>
                    <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/login'>Prijavite se</Link>
                    <Link className="border border-white px-8 py-2 rounded-xl hover:bg-white hover:text-black hover:scale-105 duration-300 font-black" to='/register'>Pridružite nam se</Link>
                </div>
                <div className="md:hidden">
                    <svg onClick={openBurger} className="w-[20px] cursor-pointer"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> </g></svg>
                </div>
                {burger ?
                <div className="absolute top-16 left-0 right-0 bg-orange-500 block md:hidden"> 
                    <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
                        <div className="flex flex-col py-8 gap-8 text-center"> 
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/become-a-meister'>Postanite majstor</Link>
                            <Link className="hover:text-gray-300 hover:scale-105 duration-300" to='/login'>Prijavite se</Link>
                            <Link className="border border-white px-8 py-2 rounded-xl hover:bg-white hover:text-black hover:scale-105 duration-300 font-black" to='/register'>Pridružite nam se</Link>
                        </div>
                    </div>
                </div> 
                : 
                <div className="hidden">
                
                </div>}
            </div>
        </div>
    </div>
  )
}

export default Navbar