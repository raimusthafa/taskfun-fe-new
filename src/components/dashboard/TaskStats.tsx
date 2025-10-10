import { useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, ListIcon } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

export function TaskStats() {
  const { tasks, loading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  const stats = [{
    title: 'Total Tugas',
    value: totalTasks,
    icon: <ListIcon size={24} className="text-blue-500" />,
    bgColor: 'bg-blue-50'
  }, {
    title: 'Selesai',
    value: completedTasks,
    icon: <CheckCircleIcon size={24} className="text-green-500" />,
    bgColor: 'bg-green-50'
  }, {
    title: 'Dalam Proses',
    value: inProgressTasks,
    icon: <ClockIcon size={24} className="text-yellow-500" />,
    bgColor: 'bg-yellow-50'
  }, {
    title: 'Menunggu',
    value: pendingTasks,
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
