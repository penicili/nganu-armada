import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalKendaraan from './ModalKendaraan';

const ManajemenKendaraan = () => {
  const [kendaraan, setKendaraan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kendaraanTerpilih, setKendaraanTerpilih] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const ambilDataKendaraan = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data kendaraan');
      }

      const data = await response.json();
      if (data && data.data) {
        setKendaraan(data.data);
      } else {
        setKendaraan([]);
      }
    } catch (error) {
      console.error('Error mengambil data kendaraan:', error);
      setKendaraan([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    ambilDataKendaraan();
  }, []);

  const handleTambahKendaraan = () => {
    setKendaraanTerpilih(null);
    setIsModalOpen(true);
  };

  const handleEditKendaraan = (kendaraan) => {
    setKendaraanTerpilih(kendaraan);
    setIsModalOpen(true);
  };

  const handleHapusKendaraan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
      try {
        const response = await fetch(`/api/vehicles/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus kendaraan');
        }

        ambilDataKendaraan();
      } catch (error) {
        console.error('Error menghapus kendaraan:', error);
        alert('Gagal menghapus kendaraan');
      }
    }
  };

  const getWarnaStatus = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'InUse':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIndonesia = (status) => {
    switch (status) {
      case 'Available':
        return 'Tersedia';
      case 'InUse':
        return 'Sedang Digunakan';
      case 'Maintenance':
        return 'Dalam Perbaikan';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kendaraan</h1>
        <button
          onClick={handleTambahKendaraan}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Tambah Kendaraan
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor Plat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kendaraan.map((kendaraan) => (
                <tr key={kendaraan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kendaraan.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kendaraan.plate_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getWarnaStatus(kendaraan.status)}`}>
                      {getStatusIndonesia(kendaraan.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditKendaraan(kendaraan)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleHapusKendaraan(kendaraan.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalKendaraan
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        kendaraan={kendaraanTerpilih}
        onSuccess={ambilDataKendaraan}
      />
    </div>
  );
};

export default ManajemenKendaraan; 