import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'

const dataPasien = [
  {
    no: 1,
    nomorPasien: 'P001',
    namaPasien: 'Budi Santoso',
    layanan: 'Scaling',
    tanggal: '2026-03-15',
    noTelp: '08123456789',
  },
  {
    no: 2,
    nomorPasien: 'P002',
    namaPasien: 'Siti Nurhaliza',
    layanan: 'Tambal Gigi',
    tanggal: '2026-03-14',
    noTelp: '08234567890',
  },
  {
    no: 3,
    nomorPasien: 'P003',
    namaPasien: 'Ahmad Wijaya',
    layanan: 'Cabut Gigi',
    tanggal: '2026-03-13',
    noTelp: '08345678901',
  },
  {
    no: 4,
    nomorPasien: 'P004',
    namaPasien: 'Rini Kusuma',
    layanan: 'Bleaching',
    tanggal: '2026-03-12',
    noTelp: '08456789012',
  },
  {
    no: 5,
    nomorPasien: 'P005',
    namaPasien: 'Hendra Gunawan',
    layanan: 'Crown',
    tanggal: '2026-03-11',
    noTelp: '08567890123',
  },
  {
    no: 6,
    nomorPasien: 'P006',
    namaPasien: 'Dita Rahmawati',
    layanan: 'Perawatan Saluran Akar',
    tanggal: '2026-03-10',
    noTelp: '08678901234',
  },
  {
    no: 7,
    nomorPasien: 'P007',
    namaPasien: 'Bambang Irawan',
    layanan: 'Veneer',
    tanggal: '2026-03-09',
    noTelp: '08789012345',
  },
  {
    no: 8,
    nomorPasien: 'P008',
    namaPasien: 'Lina Pertiwi',
    layanan: 'Aligner',
    tanggal: '2026-03-08',
    noTelp: '08890123456',
  },
  {
    no: 9,
    nomorPasien: 'P009',
    namaPasien: 'Agus Prasetyo',
    layanan: 'Gigi Tiruan',
    tanggal: '2026-03-07',
    noTelp: '08901234567',

  },
  {
    no: 10,
    nomorPasien: 'P010',
    namaPasien: 'Sari Dewi',
    layanan: 'Desensitasi Gigi',
    tanggal: '2026-03-06',
    noTelp: '08012345678',
  },
  {
    no: 11,
    nomorPasien: 'P011',
    namaPasien: 'Rizky Maulana',
    layanan: 'Perawatan Gigi Anak',
    tanggal: '2026-03-05',
    noTelp: '08123456780',
  }
]

export default function DataPasienTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return dataPasien

    const query = searchQuery.toLowerCase()
    return dataPasien.filter((pasien) =>
      pasien.nomorPasien.toLowerCase().includes(query) ||
      pasien.namaPasien.toLowerCase().includes(query) ||
      pasien.layanan.toLowerCase().includes(query) ||
      pasien.noTelp.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="space-y-4">
      <InputGroup className='w-1/2'>
        <InputGroupInput
          placeholder="Cari berdasarkan nomor pasien, nama, layanan, atau nomor telp..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <InputGroupAddon>
          <Search size={20} className="text-gray-500" />
        </InputGroupAddon>
      </InputGroup>

      {filteredData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data pasien yang sesuai dengan pencarian.</p>
        </div>
      ) : (
        <>
          <Table className='rounded-xl'>
            <TableCaption>Daftar data pasien Tentang Dental ({filteredData.length} dari {dataPasien.length})</TableCaption>
            <TableHeader className='border-primary bg-[#E0F4FB] rounded-xl'>
              <TableRow>
                <TableHead className="w-12.5">No</TableHead>
                <TableHead>Nomor Pasien</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Tanggal Kunjungan</TableHead>
                <TableHead>No Telp</TableHead>
                <TableHead className="text-center">Formulir</TableHead>
                <TableHead className="text-center">Rontgen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((pasien) => (
                <TableRow key={pasien.nomorPasien}>
                  <TableCell className="font-medium">{pasien.no}</TableCell>
                  <TableCell>{pasien.nomorPasien}</TableCell>
                  <TableCell>{pasien.namaPasien}</TableCell>
                  <TableCell>{pasien.layanan}</TableCell>
                  <TableCell>{pasien.tanggal}</TableCell>
                  <TableCell>{pasien.noTelp}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="default" size="sm">
                      Lihat
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="default" size="sm">
                      Lihat
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}