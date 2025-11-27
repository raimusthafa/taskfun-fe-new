import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Task } from '@/types/task';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  tasks: Task[];
  color: string;
  onAddTask: () => void;
}

export default function KanbanColumn({ id, title, count, tasks, color, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      className={`bg-gray-50 rounded-lg p-4 transition-all ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAddTask}
          className="text-gray-500 hover:text-blue-600"
        />
      </div>

      <SortableContext id={id} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="space-y-3 min-h-[400px] transition-colors"
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
              <p>Tidak ada task</p>
              <p className="text-xs">Drag task ke sini</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}
