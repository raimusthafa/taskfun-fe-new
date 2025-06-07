import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
export function History() {
  const historyItems = [{
    id: 1,
    task: 'Membuat Desain Landing Page',
    status: 'completed',
    date: '15 Agustus 2023, 14:30',
    user: 'Andi Pratama',
    notes: 'Selesai tepat waktu'
  }, {
    id: 2,
    task: 'Mengupdate Database',
    status: 'cancelled',
    date: '14 Agustus 2023, 11:20',
    user: 'Budi Santoso',
    notes: 'Dibatalkan karena perubahan rencana'
  }, {
    id: 3,
    task: 'Testing Aplikasi Mobile',
    status: 'updated',
    date: '13 Agustus 2023, 09:45',
    user: 'Citra Dewi',
    notes: "Status diubah dari 'Tertunda' menjadi 'Dalam Proses'"
  }, {
    id: 4,
    task: 'Meeting dengan Klien',
    status: 'completed',
    date: '12 Agustus 2023, 16:00',
    user: 'Deni Cahyadi',
    notes: 'Meeting berjalan lancar'
  }, {
    id: 5,
    task: 'Setup Server Baru',
    status: 'updated',
    date: '11 Agustus 2023, 13:15',
    user: 'Eko Prasetyo',
    notes: 'Tenggat waktu diperpanjang'
  }];
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case 'cancelled':
        return <XCircleIcon size={20} className="text-red-500" />;
      case 'updated':
        return <ArrowRightIcon size={20} className="text-blue-500" />;
      default:
        return <ClockIcon size={20} className="text-gray-500" />;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'updated':
        return 'Diperbarui';
      default:
        return status;
    }
  };
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Riwayat Aktivitas</h1>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-medium">Aktivitas Terbaru</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              <option>Semua Aktivitas</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
              <option>Diperbarui</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              <option>Semua Pengguna</option>
              <option>Andi Pratama</option>
              <option>Budi Santoso</option>
              <option>Citra Dewi</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {historyItems.map(item => <div key={item.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="mr-4">{getStatusIcon(item.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{item.task}</h3>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full mr-2 ${item.status === 'completed' ? 'bg-green-100 text-green-800' : item.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {getStatusText(item.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      oleh {item.user}
                    </span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </div>;
}