import { Link } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Silk', value: 'silk', image: 'silk.jpg' },
  { name: 'Cotton', value: 'cotton', image: 'cotton.jpg' },
  { name: 'Linen', value: 'linen', image: 'lenan.jpg' },
  { name: 'Bridal Edit', value: 'bridal', image: 'bridal.jpg' },
]

function CategoryBand() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/5">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.name}
          to={`/shop?category=${cat.value}`}
          className="relative aspect-square md:aspect-[1/1.1] overflow-hidden group shadow-soft block"
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-4 md:bottom-5 left-0 right-0 text-center">
            <span className="font-serif italic text-white text-lg md:text-2xl drop-shadow-md">
              {cat.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CategoryBand
