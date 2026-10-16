import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-[#f5f1e8] relative overflow-hidden">
      <img
        src="/main.png"
        alt="her grace, her weave — The New Collection"
        className="w-full h-auto object-cover block"
      />

      {/* Invisible clickable button layered over the "Explore Collection" area
          baked into the image design. Positioned roughly where that button
          sits on desktop vs mobile crops — nudge the % values if it drifts
          once you see it against your actual image. */}
      <Link
        to="/shop"
        aria-label="Explore Collection"
        className="
          absolute
          bottom-[12%] right-[8%]
          w-[22%] h-[7%]
          sm:bottom-[14%] sm:right-[10%] sm:w-[20%] sm:h-[6%]
        "
      />
    </section>
  )
}

export default Hero
