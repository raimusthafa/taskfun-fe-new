import { CheckCircleIcon, ClockIcon, CalendarIcon, TagIcon } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

export function TaskCard() {
  const { tasks } = useTaskStore();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'in_progress':
        return <ClockIcon size={16} className="text-yellow-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{task.tugas}</h3>
              <div className="flex items-center">
                {getStatusIcon(task.status)}
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{task.deskripsi}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <CalendarIcon size={14} className="mr-1" />
              <span>{task.tenggat}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-2">
                <div className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.prioritas)}`}>
                  {task.prioritas}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
