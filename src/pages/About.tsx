import { InfoIcon, HelpCircleIcon, FileTextIcon, UserIcon, MailIcon } from 'lucide-react';
export function About() {
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tentang Aplikasi</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white mr-4">
            <InfoIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Task Manager</h2>
            <p className="text-gray-500">Versi 1.0.0</p>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          Task Manager adalah aplikasi manajemen tugas yang dirancang untuk
          membantu tim dan individu mengelola tugas mereka dengan lebih efisien.
          Aplikasi ini menyediakan berbagai fitur untuk melacak, mengelola, dan
          menyelesaikan tugas dengan lebih terorganisir.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <HelpCircleIcon size={20} className="text-blue-500 mr-2" />
              <h3 className="font-medium">Bantuan & Dukungan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Butuh bantuan menggunakan aplikasi? Hubungi tim dukungan kami atau
              kunjungi pusat bantuan.
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Pusat Bantuan
            </button>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileTextIcon size={20} className="text-blue-500 mr-2" />
              <h3 className="font-medium">Dokumentasi</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Akses dokumentasi lengkap untuk mempelajari semua fitur dan
              kemampuan aplikasi.
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Buka Dokumentasi
            </button>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-medium mb-4">Tim Pengembang</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(item => <div key={item} className="border border-gray-100 rounded-lg p-4 flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <UserIcon size={16} className="text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium">Pengembang #{item}</h4>
                  <p className="text-sm text-gray-500">Jabatan</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MailIcon size={14} className="mr-1" />
                    email@example.com
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-2">
          © 2023 Task Manager. Semua hak dilindungi.
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <button className="text-blue-600 hover:text-blue-800">
            Syarat & Ketentuan
          </button>
          <button className="text-blue-600 hover:text-blue-800">
            Kebijakan Privasi
          </button>
          <button className="text-blue-600 hover:text-blue-800">Kontak</button>
        </div>
      </div>
    </div>;
}