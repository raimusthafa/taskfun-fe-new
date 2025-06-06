import { CheckCircleIcon, ClockIcon, CalendarIcon, TagIcon } from 'lucide-react';
interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  tags: string[];
}
interface TaskCardProps {
  tasks: Task[];
}
export function TaskCard({
  tasks
}: TaskCardProps) {
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
      case 'completed':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'in-progress':
        return <ClockIcon size={16} className="text-yellow-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-500" />;
    }
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => <div key={task.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{task.title}</h3>
              <div className="flex items-center">
                {getStatusIcon(task.status)}
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{task.description}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <CalendarIcon size={14} className="mr-1" />
              <span>{task.dueDate}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                    <TagIcon size={10} className="mr-1" />
                    {tag}
                  </div>)}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>
            </div>
          </div>
        </div>)}
    </div>;
}