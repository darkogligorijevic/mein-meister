import Category from "./Category";
import categories from '../data/categories.json';

const Categories = () => {
  return (
    <div className="py-[128px]">
      <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        <div className="flex flex-col gap-4 mb-16 2xl:w-full">
          <div className="w-20 h-[2px] bg-black"></div>
          <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-bold lg:w-1/2">Izaberi majstora po kategoriji</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
          {categories?.map((category, index) => (
            <Category
                key={category.id}
                imageUrl={category.imgUrl}
                title={category.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;