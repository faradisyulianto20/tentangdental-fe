import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: 'Budi Santoso',
    description:
      'Pelayanan di Tentang Dental sangat profesional. Proses scaling giginya cepat dan tidak sakit sama sekali. Ruang tunggunya juga nyaman banget!',
    imgUrl: '/muka.svg',
    rating: 5,
  },
  {
    name: 'Siti Aminah',
    description:
      'Dokternya sangat sabar menjelaskan detail kesehatan gigi saya. Fasilitasnya modern dan sangat bersih. Sangat direkomendasikan untuk keluarga.',
    imgUrl: '/muka2.svg',
    rating: 5,
  },
  {
    name: 'Rian Hidayat',
    description:
      'Tempat praktik gigi terbaik di kota ini. Harganya cukup terjangkau dengan kualitas pelayanan bintang lima. Staf administrasinya juga ramah.',
    imgUrl: '/muka3.svg',
    rating: 4,
  },
  {
    name: 'Dewi Lestari',
    description:
      'Baru pertama kali ke sini untuk cabut gigi bungsu dan pengalamannya luar biasa minim rasa sakit. Alat-alatnya terlihat sangat steril.',
    imgUrl: '/muka4.svg',
    rating: 5,
  },
  {
    name: 'Andi Wijaya',
    description:
      'Sistem booking-nya sangat mudah via WhatsApp. Tidak perlu antre lama karena jadwalnya sangat on-time. Dokter giginya sangat berpengalaman.',
    imgUrl: '/muka5.svg',
    rating: 4,
  },
  {
    name: 'Farah Quinnisa',
    description:
      'Sangat puas dengan hasil pemutihan gigi (bleaching) di sini. Hasilnya natural dan konsultasinya sangat mendalam. Sukses terus Tentang Dental!',
    imgUrl: '/muka6.svg',
    rating: 5,
  },
]

export default function Testimoni() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  console.log(currentTestimonial)

  useEffect(() => {
    // Set interval tiap 3000ms (3 detik)
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) =>
          // Menggunakan modulo agar setelah index terakhir kembali ke 0
          (prev + 1) % testimonials.length,
      )
    }, 3000)

    // Membersihkan interval saat komponen tidak lagi digunakan (unmount)
    // Ini penting agar tidak terjadi memory leak atau double interval
    return () => clearInterval(interval)
  }, [testimonials.length]) // Dependency array

  const testimonial = testimonials[currentTestimonial]
  const otherTestimonials = testimonials.filter(
    (_, index) => index !== currentTestimonial,
  )
  return (
    <section className="flex flex-col md:flex-row md:items-end gap-6 py-12 md:py-20 text-center justify-between max-w-6xl mx-6">
      {/* Sembunyikan seluruh decorative element di mobile */}
      <div className="hidden lg:flex gap-2 items-end relative">
        <div className="bg-primary w-[155px] h-[242px] rounded-tr-4xl rounded-bl-4xl rounded" />
        <div className="bg-[#B9D654] w-[156px] h-[98px] rounded rounded-tl-4xl rounded-br-4xl" />
        <div className="absolute right-16 -top-40 w-[300px] h-[300px]">
          <img
            src={otherTestimonials[0].imgUrl}
            alt="Testimoni Image"
            className="w-[120px] rounded-full h-[120px] object-cover absolute top-12 right-12"
          />
          <img
            src={otherTestimonials[1].imgUrl}
            alt="Testimoni Image"
            className="w-[74px] rounded-full h-[74px] object-cover absolute top-12 -left-20"
          />
          <img
            src={otherTestimonials[2].imgUrl}
            alt="Testimoni Image"
            className="w-[100px] rounded-full h-[100px] object-cover absolute top-32"
          />
          <img
            src={otherTestimonials[3].imgUrl}
            alt="Testimoni Image"
            className="w-[90px] rounded-full h-[90px] object-cover absolute top-52 right-30"
          />
          <img
            src={otherTestimonials[4].imgUrl}
            alt="Testimoni Image"
            className="w-[75px] rounded-full h-[75px] object-cover absolute top-64 right-0 transform -translate-x-1/4 -translate-y-3/4"
          />
        </div>
      </div>

      {/* Mobile: tampilkan foto dalam grid biasa */}
      <div className="flex lg:hidden justify-center gap-3 flex-wrap mt-4">
        {otherTestimonials.slice(0, 5).map((t, i) => (
          <img
            key={i}
            src={t.imgUrl}
            alt="Testimoni"
            className="w-14 h-14 rounded-full object-cover"
          />
        ))}
      </div>
      <div className="text-left flex flex-col gap-2">
        <h1 className="font-bold text-primary text-xl md:text-3xl">
          Testimoni
        </h1>
        <p className="text-black font-bold max-w-md text-2xl md:text-4xl">
          Periksa apa yang dikatakan pasien tentang kami.
        </p>
        <div className="bg-[#E0F4FB] p-4 gap-2 rounded-lg">
          <img
            src="/icons/petik.svg"
            alt="Testimoni Image"
            className="w-6 h-6 object-cover"
          />
          <p className="text-muted-foreground max-w-md text-sm md:text-lg mt-6">
            {testimonial.description}
          </p>
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div className="flex gap-1 mt-6">
              <img
                src={testimonial.imgUrl}
                alt="Testimoni Image"
                className="w-12 h-12 rounded-full shadow-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <p className="text-muted-foreground max-w-md md:text-lg">
                  {testimonial.name}
                </p>
                <div className="flex w-4 h-4 gap-1">
                  {Array.from({ length: testimonial.rating }).map(
                    (_, index) => (
                      <img
                        key={index}
                        src="/icons/star.svg"
                        alt="Testimoni Image"
                        className="shadow-lg object-cover"
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between self-justify-end">
              <ChevronLeft
                className={
                  'bg-[#B4E5F6] rounded-full hover:bg-[#B4E5F6]/50 cursor-pointer'
                }
                onClick={() =>
                  setCurrentTestimonial(
                    (currentTestimonial - 1 + testimonials.length) %
                      testimonials.length,
                  )
                }
              />
              <div className="flex items-center gap-1 mx-2">
                {testimonials.map((testi, index) => (
                  <div
                    className={`w-2 h-2 ${testimonial.name === testi.name ? 'bg-[#B4E5F6]' : 'bg-[#B4E5F6]/50'} rounded-full`}
                    key={index}
                  ></div>
                ))}
              </div>
              <ChevronRight
                className={
                  'bg-[#B4E5F6] rounded-full hover:bg-[#B4E5F6]/50 cursor-pointer'
                }
                onClick={() =>
                  setCurrentTestimonial(
                    (currentTestimonial + 1) % testimonials.length,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
