function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4.2] bg-stone rounded-lg" />
      <div className="mt-3 h-3.5 bg-stone rounded w-4/5" />
      <div className="mt-2 h-3.5 bg-stone rounded w-1/3" />
    </div>
  )
}

export default ProductCardSkeleton
