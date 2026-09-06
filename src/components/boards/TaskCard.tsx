import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from 'antd';
import { Calendar, Clock, AlertCircle, GripVertical, CheckCircle2 } from 'lucide-react';
import type { Task } from '@/types/task';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = dayjs(task.tenggat).isBefore(dayjs(), 'day') && task.status !== 'done';
  const daysUntilDue = dayjs(task.tenggat).diff(dayjs(), 'day');

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Tinggi
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Sedang
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Rendah
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {priority}
          </span>
        );
    }
  };

  const getDueDateDisplay = () => {
    if (task.status === 'done') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" />
          Selesai
        </span>
      );
    }

    if (isOverdue) {
      return (
        <Tooltip title="Tenggat waktu sudah terlewat!">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Terlewat {Math.abs(daysUntilDue)} hari
          </span>
        </Tooltip>
      );
    }

    if (daysUntilDue === 0) {
      return (
        <Tooltip title="Jatuh tempo hari ini">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Clock className="w-3 h-3" />
            Hari ini
          </span>
        </Tooltip>
      );
    }

    if (daysUntilDue === 1) {
      return (
        <Tooltip title="Jatuh tempo besok">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            <Clock className="w-3 h-3" />
            Besok
          </span>
        </Tooltip>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
        <Calendar className="w-3 h-3 text-gray-400" />
        {dayjs(task.tenggat).format('DD MMM YYYY')}
      </span>
    );
  };

  const handleClick = () => {
    // Mencegah klik jika sedang drag
    if (isDragging || isSortableDragging) return;
    // Jangan navigate jika menekan tombol aksi internal
    navigate(`/tugas/${task.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative bg-white rounded-xl border p-3.5 transition-all duration-200 select-none cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'shadow-2xl scale-[1.03] rotate-1 ring-2 ring-blue-500/50 bg-white/95 backdrop-blur-xs border-blue-200 z-50'
          : isSortableDragging
          ? 'opacity-30 border-dashed border-2 border-blue-300 shadow-none'
          : 'border-gray-200/80 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header: Category & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.category?.category && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              {task.category.category}
            </span>
          )}
          {getPriorityBadge(task.prioritas)}
        </div>

        <div className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Task Title */}
      <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
        {task.tugas}
      </h4>

      {/* Task Description */}
      {task.deskripsi && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
          {task.deskripsi}
        </p>
      )}

      {/* Bottom Footer: Due Date & Collaborator/User Info */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100/90 text-xs">
        <div>{getDueDateDisplay()}</div>

        {task.user?.fullname && (
          <Tooltip title={`Dibuat oleh: ${task.user.fullname}`}>
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              {task.user.fullname.charAt(0).toUpperCase()}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
