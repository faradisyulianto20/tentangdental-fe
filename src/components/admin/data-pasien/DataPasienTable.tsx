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
} from '@/components/ui/input-group'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'

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
  },
]

export default function DataPasienTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const navigate = useNavigate()

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return dataPasien

    const query = searchQuery.toLowerCase()
    return dataPasien.filter(
      (pasien) =>
        pasien.nomorPasien.toLowerCase().includes(query) ||
        pasien.namaPasien.toLowerCase().includes(query) ||
        pasien.layanan.toLowerCase().includes(query) ||
        pasien.noTelp.toLowerCase().includes(query),
    )
  }, [searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

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
  
  const handleNavigate = (id: string) => {
    navigate({
      to: '/admin/data-pasien/rontgen',
      search: { id },
    })
  }

  return (
    <div className="space-y-4 w-full">
      <InputGroup className="w-full md:w-1/2">
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
          <p className="text-gray-500">
            Tidak ada data pasien yang sesuai dengan pencarian.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <Table className="rounded-xl">
              <TableCaption className="text-xs md:text-sm">
                Daftar data pasien Tentang Dental ({filteredData.length} dari{' '}
                {dataPasien.length})
              </TableCaption>
              <TableHeader className="border-primary bg-[#E0F4FB] rounded-xl">
                <TableRow>
                  <TableHead className="w-8 md:w-12 text-xs md:text-sm">
                    No
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Nomor Pasien
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Nama Pasien
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Layanan
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    Tanggal Kunjungan
                  </TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">
                    No Telp
                  </TableHead>
                  <TableHead className="text-center text-xs md:text-sm">
                    Formulir
                  </TableHead>
                  <TableHead className="text-center text-xs md:text-sm">
                    Rontgen
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((pasien) => (
                  <TableRow key={pasien.nomorPasien}>
                    <TableCell className="font-medium text-xs md:text-sm">
                      {pasien.no}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.nomorPasien}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.namaPasien}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.layanan}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.tanggal}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {pasien.noTelp}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs md:text-sm"
                        onClick={() =>
                          navigate({
                            to: '/admin/data-pasien',
                            search: { id: pasien.nomorPasien },
                          })
                        }
                      >
                        Lihat
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs md:text-sm"
                        onClick={() =>
                          handleNavigate(pasien.nomorPasien)
                        }
                      >
                        Lihat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="text-xs md:text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages || 1}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 md:w-10 md:h-10 p-0 text-xs md:text-sm"
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
