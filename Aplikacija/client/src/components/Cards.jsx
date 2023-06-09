import Card from "./Card"
import { Link } from "react-router-dom"

const Cards = () => {
  return (
    <div className="py-[128px]">
    <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        
            <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row justify-between">
                    <div className="space-y-5 xl:w-1/2 2xl:w-1/3">
                        <div className="w-20 h-[2px] bg-black"></div>
                        <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold lg:w-1/2">Ko smo mi?</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut doloribus quibusdam ad. Veniam sed dolor molestiae </p>
                    </div>
                    <Link to='/register' className="text-center px-4 bg-transparent border border-black rounded-xl sm:self-start sm:px-8 py-2 sm:hover:scale-105 sm:hover:bg-black sm:hover:text-white sm:duration-300 lg:self-start mt-4 font-black">Pridruzite nam se</Link>
                </div>
            </div>
        

        <div className="flex flex-col 2xl:flex-row xl:gap-8 mt-24 2xl:mt-32">
            <Card num={"01"} heading={"Nadji brzo i lako"} desc={"Samo uz nekoliko klikova dolazite do pronalaska majstora u Vasoj okolini koji ce se uvek pobrinuti za Vas problem."}/>
            <Card num={"02"} heading={"Nadji brzo i lako"} desc={"Samo uz nekoliko klikova dolazite do pronalaska majstora u Vasoj okolini koji ce se uvek pobrinuti za Vas problem."}/>
            <Card num={"03"} heading={"Nadji brzo i lako"} desc={"Samo uz nekoliko klikova dolazite do pronalaska majstora u Vasoj okolini koji ce se uvek pobrinuti za Vas problem."}/>
        </div>
    </div>
</div>
  )
}

export default Cards