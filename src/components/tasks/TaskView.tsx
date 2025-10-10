import { useState, useEffect } from 'react';
import { LayoutGridIcon, ListIcon, CalendarIcon } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskTable } from './TaskTable';
import { TaskCalendar } from './TaskCalendar';
import { Button, message } from 'antd';
import TaskModal, { type TaskSubmitValues } from '../ModalTask';
import { PlusOutlined } from '@ant-design/icons';
import { useTaskStore } from '../../store/useTaskStore';
import { useUserStore } from '../../store/useUserStore';
import { useCategoryStore } from '../../store/useCategoryStore';

export function TaskView() {
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'calendar'>('card');
  const [visible, setVisible] = useState(false);
  
  const { tasks, loading, fetchTasks, createTask } = useTaskStore();
  const { user } = useUserStore();
  const { categories } = useCategoryStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (values: TaskSubmitValues) => {
    try {
      // Find the selected category ID
      const selectedCategory = categories.find(cat => cat.category === values.kategori);
      const categoryId = selectedCategory ? selectedCategory.id_category : 1;

      const taskData = {
        tugas: values.tugas,
        deskripsi: values.deskripsi,
        prioritas: values.prioritas,
        tenggat: values.tenggat,
        status: values.status,
        id_user: user ? parseInt(user.id_user) : 1,
        id_category: categoryId
      };

      await createTask(taskData);
      message.success('Tugas berhasil ditambahkan!');
      setVisible(false);
    } catch (error) {
      message.error('Gagal menambahkan tugas');
    }
  };

  const calendarTasks = tasks.map(task => ({
    id: task.id,
    title: task.tugas,
    date: task.tenggat,
    priority: task.prioritas
  }));

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }

  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setViewMode('card')} className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'card' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
            <LayoutGridIcon size={16} className="mr-2" />
            Kartu
          </button>
          <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
            <ListIcon size={16} className="mr-2" />
            Tabel
          </button>
          <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
            <CalendarIcon size={16} className="mr-2" />
            Kalender
          </button>
        </div>
      <Button type="primary" onClick={() => setVisible(true)} icon={<PlusOutlined />} size="large">
        Tambah Tugas
      </Button>

      <TaskModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleSubmit}
      />
      </div>
      <div>
        {viewMode === 'card' && <TaskCard />}
        {/* {viewMode === 'table' && <TaskTable tasks={tasks} />}
        {viewMode === 'calendar' && <TaskCalendar tasks={calendarTasks} />} */}
      </div>
    </div>;
}
