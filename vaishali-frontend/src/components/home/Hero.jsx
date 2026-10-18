import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-[#f5f1e8] relative overflow-hidden">
      {/* MOBILE: tall image */}
      <div className="md:hidden relative h-[78vh] min-h-[520px]">
        <img
          src="/main.png"
          alt="Woman wearing a traditional saree"
          className="absolute inset-0 w-full h-full object-cover object-[28%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-ivory/80 mb-2">The New Collection</p>
          <h1 className="font-serif italic text-5xl leading-[0.95] text-ivory">
            her grace,<br />her weave.
          </h1>
          <Link
            to="/shop"
            className="mt-5 inline-flex items-center gap-2 bg-ivory text-sage-dark px-8 py-3 rounded-lg text-sm shadow-lift"
          >
            Explore Collection <span>→</span>
          </Link>
        </div>
      </div>

      {/* DESKTOP/TABLET: full poster, unchanged */}
      <div className="hidden md:block relative">
        <img src="/main.png" alt="her grace, her weave — The New Collection" className="w-full h-auto object-cover block" />
        <Link
          to="/shop"
          aria-label="Explore Collection"
          className="absolute bottom-[14%] right-[10%] w-[20%] h-[6%]"
        />
      </div>
    </section>
  )
}

export default Hero