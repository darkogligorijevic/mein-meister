
const Category = ({imageUrl, title}) => {
  return (
    <div className="relative bg-no-repeat bg-cover h-[400px] rounded-2xl cursor-pointer hover:scale-95 duration-300" style={{ backgroundImage: `url("${imageUrl}")` }}>
        <div className="absolute inset-0 bg-black opacity-30 duration-300 rounded-2xl"></div>
        <div className="absolute top-0 left-0 right-0 px-4 py-4 h-full flex flex-col justify-start gap-2 text-white md:gap-8">
            <h3 className="text-5xl font-black md:w-1/2 sm:text-5xl md:text-5xl xl:text-5xl 2xl:text-5xl">{title}</h3>
        </div>
    </div>
  )
}

export default Category