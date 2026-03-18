import * as z from 'zod'

export const reservasiSchema = z.object({
  namaLengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  nomorHandphone: z.string().min(1, 'Nomor handphone wajib diisi'),
  tanggalLahir: z.date({
    error: () => ({ message: 'Tanggal lahir wajib diisi' }),
  }),
  umur: z.string().optional(),
  jadwalPeriksa: z.date({
    error: () => ({ message: 'Jadwal periksa wajib diisi' }),
  }),
  jamReservasi: z.string().min(1, 'Jam reservasi wajib diisi'),
  pilihanDokter: z.string().min(1, 'Pilihan dokter wajib diisi'),
  layanan: z.array(z.string()).min(1, 'Layanan wajib dipilih'),
  nomorPasien: z.string().optional(),
  keluhan: z.string().optional(),
})

export type ReservasiForm = z.infer<typeof reservasiSchema>
