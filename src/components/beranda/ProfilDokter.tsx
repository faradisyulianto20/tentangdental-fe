export default function ProfilDokter() {
  return (
    <div>
      <h1 className="text-primary text-3xl font-bold">Profil Dokter</h1>
      <p className="text-muted-foreground mb-12">Temukan dokter-dokter profesional</p>
      <div className="flex flex-col gap-4 mt-6 justify-center w-full">
        {listDokter.map((dokter, index) => (
          <div className={` ${index % 2 === 0 ? 'ms-auto' : 'flex-row-reverse'} flex w-3/4 rounded-lg shadow-md  border-2 mt-6`}>
            <div className="p-4">
              <p className="text-muted-foreground text-sm">{dokter.deskripsi}</p>
              <p className="font-bold text-lg mt-6">{dokter.nama}</p>
              <p className="font-bold text-muted-foreground">{dokter.spesialis}</p>
            </div>
            <div className="w-full relative -bottom-3">
              <img src={dokter.imgUrl} className="w-92 object-cover absolute right-0 z-10 bottom-0 max-h-[400px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const listDokter = [
  {
    imgUrl: 'dokter.png',
    nama: 'Drg. Sania Dara Afiati, Sp.KG',
    spesialis: 'Spesialis Konversi Gigi',
    deskripsi:
      'Sebagai spesialis konservasi gigi, perhatian utama saya adalah menjaga serta merawat gigi alami Anda agar tetap sehat dan berfungsi optimal dalam jangka panjang, melalui perawatan yang tepat, modern, dan berstandar tinggi.',
  },
  {
    imgUrl: 'dokter.png',
    nama: 'Drg. Sania Dara Afiati, Sp.KG',
    spesialis: 'Spesialis Konversi Gigi',
    deskripsi:
      'Sebagai spesialis konservasi gigi, perhatian utama saya adalah menjaga serta merawat gigi alami Anda agar tetap sehat dan berfungsi optimal dalam jangka panjang, melalui perawatan yang tepat, modern, dan berstandar tinggi.',
  }
]
