import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

interface CalendarTask {
  id: number;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export function TaskCalendar() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentMonth = `${monthNames[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay(); // 0 = Sunday
  const calendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1
  );

const calendarTasks: CalendarTask[] = tasks
  .filter(task => {
    const taskDate = new Date(task.tenggat);
    return (
      taskDate.getFullYear() === year &&
      taskDate.getMonth() === month
    );
  })
  .map(task => ({
    id: Number(task.id) || Math.random(),
    title: task.tugas,
    date: task.tenggat,
    priority: task.prioritas as 'high' | 'medium' | 'low'
  }));

// Map tasks to days
const tasksByDay: Record<string, CalendarTask[]> = {};
calendarTasks.forEach(task => {
  const taskDate = new Date(task.date);
  const day = taskDate.getDate().toString();
  if (!tasksByDay[day]) tasksByDay[day] = [];
  tasksByDay[day].push(task);
});


  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-semibold">{currentMonth}</h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysOfWeek.map((day: string, i: number) => (
          <div key={i} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {calendarDays.map((day: number | null, i: number) => {
          const dayTasks = day ? tasksByDay[day.toString()] || [] : [];
          return (
            <div
              key={i}
              className={`bg-white min-h-[100px] p-2 ${day ? '' : 'bg-gray-50'} ${
                day && isToday(day) ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
            >
              {day && (
                <>
                  <div className={`text-right ${isToday(day) ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(task.priority)}`}></div>
                        <div className="text-sm truncate">{task.title}</div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 pl-3">+{dayTasks.length - 3} lagi</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}