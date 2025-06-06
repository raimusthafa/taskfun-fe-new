import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface CalendarTask {
  id: number;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}
interface TaskCalendarProps {
  tasks: CalendarTask[];
}
export function TaskCalendar({
  tasks
}: TaskCalendarProps) {
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const currentMonth = 'Agustus 2023';
  // Generate calendar days for demo
  const daysInMonth = 31;
  const firstDayOffset = 2; // Tuesday is the first day of the month
  const calendarDays = Array.from({
    length: daysInMonth + firstDayOffset
  }, (_, i) => {
    if (i < firstDayOffset) return null;
    return i - firstDayOffset + 1;
  });
  // Map tasks to days
  const tasksByDay: Record<string, CalendarTask[]> = {};
  tasks.forEach(task => {
    const day = task.date.split('-')[2]; // Extract day from YYYY-MM-DD
    if (!tasksByDay[day]) tasksByDay[day] = [];
    tasksByDay[day].push(task);
  });
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-semibold">{currentMonth}</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysOfWeek.map((day, i) => <div key={i} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>)}
        {calendarDays.map((day, i) => {
        const isToday = day === 15; // Assuming today is the 15th
        const dayTasks = day ? tasksByDay[day.toString()] || [] : [];
        return <div key={i} className={`bg-white min-h-[100px] p-2 ${day ? '' : 'bg-gray-50'} ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
              {day && <>
                  <div className={`text-right ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map(task => <div key={task.id} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(task.priority)}`}></div>
                        <div className="text-xs truncate">{task.title}</div>
                      </div>)}
                    {dayTasks.length > 3 && <div className="text-xs text-gray-500 pl-3">
                        +{dayTasks.length - 3} lagi
                      </div>}
                  </div>
                </>}
            </div>;
      })}
      </div>
    </div>;
}