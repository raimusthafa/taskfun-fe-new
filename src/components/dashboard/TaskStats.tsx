
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, ListIcon } from 'lucide-react';
export function TaskStats() {
  const stats = [{
    title: 'Total Tugas',
    value: 24,
    icon: <ListIcon size={24} className="text-blue-500" />,
    bgColor: 'bg-blue-50'
  }, {
    title: 'Selesai',
    value: 12,
    icon: <CheckCircleIcon size={24} className="text-green-500" />,
    bgColor: 'bg-green-50'
  }, {
    title: 'Dalam Proses',
    value: 8,
    icon: <ClockIcon size={24} className="text-yellow-500" />,
    bgColor: 'bg-yellow-50'
  }, {
    title: 'Terlambat',
    value: 4,
    icon: <AlertCircleIcon size={24} className="text-red-500" />,
    bgColor: 'bg-red-50'
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => <div key={index} className={`${stat.bgColor} rounded-lg p-6 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="rounded-full p-3 bg-white">{stat.icon}</div>
          </div>
        </div>)}
    </div>;
}