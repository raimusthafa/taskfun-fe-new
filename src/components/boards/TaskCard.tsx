import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, FlagOutlined } from '@ant-design/icons';
import type { Task } from '@/types/task';
import dayjs from 'dayjs';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a',
};

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
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
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const isOverdue = dayjs(task.tenggat).isBefore(dayjs(), 'day') && task.status !== 'done';
  const daysUntilDue = dayjs(task.tenggat).diff(dayjs(), 'day');

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow ${
          isDragging ? 'shadow-2xl rotate-3' : ''
        } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
        size="small"
        bordered
      >
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1">
              {task.tugas}
            </h4>
            <Tag
              color={priorityColors[task.prioritas]}
              className="text-xs flex items-center gap-1"
            >
              <FlagOutlined />
              {priorityLabels[task.prioritas]}
            </Tag>
          </div>

          {task.deskripsi && (
            <p className="text-xs text-gray-500 line-clamp-2">{task.deskripsi}</p>
          )}

          <div className="flex justify-between items-center">
            <Tooltip
              title={
                isOverdue
                  ? 'Deadline sudah lewat!'
                  : daysUntilDue === 0
                  ? 'Deadline hari ini'
                  : daysUntilDue === 1
                  ? 'Deadline besok'
                  : `${daysUntilDue} hari lagi`
              }
            >
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue
                    ? 'text-red-500 font-semibold'
                    : daysUntilDue <= 2
                    ? 'text-orange-500'
                    : 'text-gray-500'
                }`}
              >
                <ClockCircleOutlined />
                {dayjs(task.tenggat).format('DD MMM YYYY')}
              </div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  );
}
