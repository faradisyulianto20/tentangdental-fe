
const images = [
    "hero4.png",
    "hero3.png",
    "hero2.png",
    "hero1.png",
    "hero.png"
]

export default function Heroes() {
  return (
    <section className="page-wrap flex flex-col md:flex-row items-center gap-6 md:py-20 text-center max-w-6xl mx-6">
      <div className="text-left flex flex-col gap-3 max-w-screen my-12">
        <h1 className="font-bold text-primary text-3xl sm:text-4xl md:text-6xl">
          Smile Makes A Lasting Impression
        </h1>
        <p className="text-muted-foreground max-w-md text-md sm:text-xl md:text-2xl">
          Senyumanmu memberikan kesan yang mendalam dan tak terlupakan.
        </p>
      </div>
      <div className="flex justify-end items-end gap-2">
  {/* Mobile: grid 2 kolom, Desktop: layout custom */}
  
  {/* Mobile layout */}
  <div className="grid grid-cols-2 gap-2 md:hidden w-full">
    {images.map((src, i) => (
      <div key={i} className={`rounded-lg overflow-hidden ${i === 0 ? 'col-span-2 h-[200px]' : 'h-[120px]'}`}>
        <img src={src} alt={`Image ${i}`} className="w-full h-full object-cover" />
      </div>
    ))}
  </div>

  {/* Desktop layout */}
  <div className="hidden md:flex justify-end items-end gap-2">
    <div className="gap-2 flex flex-col justify-end items-end">
      <div className="flex gap-2 justify-end items-end">
        <div className="flex flex-col items-end gap-2">
          <div className="w-[66px] h-[67px] rounded-lg overflow-hidden">
            <img src={images[0]} alt="Hero Image" className="w-full h-full object-cover" />
          </div>
          <div className="w-[132px] h-[39px] rounded-lg overflow-hidden">
            <img src={images[1]} alt="Hero Image" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="w-[118px] h-[137px] rounded-lg overflow-hidden">
          <img src={images[2]} alt="Hero Image" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="w-[264px] h-[80px] rounded-lg overflow-hidden">
        <img src={images[3]} alt="Hero Image" className="w-full h-full object-cover" />
      </div>
    </div>
    <div className="h-[343px] w-[171px] rounded-lg overflow-hidden shadow-lg">
      <img src={images[4]} alt="Hero Image" className="w-full h-full object-cover" />
    </div>
  </div>
</div>
    </section>
  )
}
