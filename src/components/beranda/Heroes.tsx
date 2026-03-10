
const images = [
    "hero4.png",
    "hero3.png",
    "hero2.png",
    "hero1.png",
    "hero.png"
]

export default function Heroes() {
  return (
    <section className="page-wrap flex items-center gap-6 py-20 text-center">
      <div className="text-left flex flex-col gap-3">
        <h1 className="font-bold text-primary text-6xl">
          Smile Makes A Lasting Impression
        </h1>
        <p className="text-muted-foreground max-w-md text-2xl">
          Senyumanmu memberikan kesan yang mendalam dan tak terlupakan.
        </p>
      </div>
      <div className="flex justify-end items-end gap-2">
        <div className="gap-2 flex flex-col justify-end items-end">
          <div className="flex gap-2 justify-end items-end">
            <div className="flex flex-col items-end gap-2">
                <div className="w-[66px] h-[67px] bg-black rounded-lg">
                    <img src={images[0]} alt="Hero Image" className="w-full max-w-2xl rounded-lg shadow-lg h-full object-cover" />
                </div>
              <div className="w-[132px] h-[39px] bg-black rounded-lg">
                <img
                  src={images[1]}
                  alt="Hero Image"
                  className="w-full max-w-2xl rounded-lg shadow-lg h-full object-cover"
                />
              </div>
            </div>
            <div className="w-[118px] h-[137px] bg-black rounded-lg">
              <img
                src={images[2]}
                alt="Hero Image"
                className="w-full max-w-2xl rounded-lg shadow-lg h-full object-cover"
              />
            </div>
          </div>
          <div className="w-[264px] h-[80px] bg-black rounded-lg">
            <img
              src={images[3]}
              alt="Hero Image"
              className="w-full max-w-2xl rounded-lg shadow-lg h-full object-cover"
            />
          </div>
        </div>
        <div className="h-[343px] w-[171px] object-cover bg-black rounded-lg shadow-lg">
          <img
            src={images[4]}
            alt="Hero Image"
            className="w-full max-w-2xl rounded-lg shadow-lg h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
