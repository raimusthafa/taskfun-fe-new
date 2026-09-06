import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus, Layers } from 'lucide-react';
import type { Task } from '@/types/task';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  tasks: Task[];
  color?: string;
  onAddTask: () => void;
}

export default function KanbanColumn({ id, title, count, tasks, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnStyles = (colId: string) => {
    switch (colId) {
      case 'todo':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-200',
          dot: 'bg-amber-500 shadow-amber-500/40',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          overRing: 'ring-2 ring-amber-400 bg-amber-50/70 border-amber-300',
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-200',
          dot: 'bg-blue-500 shadow-blue-500/40',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          overRing: 'ring-2 ring-blue-400 bg-blue-50/70 border-blue-300',
        };
      case 'done':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500 shadow-emerald-500/40',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          overRing: 'ring-2 ring-emerald-400 bg-emerald-50/70 border-emerald-300',
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          dot: 'bg-gray-400 shadow-gray-400/40',
          badge: 'bg-gray-100 text-gray-700 border-gray-200',
          overRing: 'ring-2 ring-gray-400 bg-gray-50 border-gray-300',
        };
    }
  };

  const styles = getColumnStyles(id);

  return (
    <div
      className={`flex flex-col rounded-2xl bg-gray-100/70 border border-gray-200/80 p-3.5 transition-all duration-200 shadow-xs ${
        isOver ? styles.overRing : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shadow-xs ${styles.dot}`} />
          <h3 className="font-bold text-gray-800 text-sm tracking-tight">{title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border shadow-2xs ${styles.badge}`}
          >
            {count}
          </span>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          title={`Tambah tugas ke ${title}`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/80 active:bg-white transition-all shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List / Drop Zone */}
      <SortableContext id={id} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 space-y-2.5 min-h-[450px] p-1 rounded-xl transition-colors"
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-xl bg-white/40 p-4 text-center">
              <Layers className="w-6 h-6 mb-2 text-gray-300 stroke-[1.5]" />
              <p className="font-medium text-gray-500">Belum ada tugas</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Tarik dan letakkan tugas ke kolom ini</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}
