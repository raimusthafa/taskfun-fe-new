import { useState } from 'react';
import { LayoutGridIcon, ListIcon, CalendarIcon } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskTable } from './TaskTable';
import { TaskCalendar } from './TaskCalendar';
import { Button, message } from 'antd';
import TaskModal, { type TaskFormValues } from '../ModalTask';
import { PlusOutlined } from '@ant-design/icons';


export function TaskView() {
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'calendar'>('card');
  const tasks = [{
    id: 1,
    title: 'Membuat Desain Landing Page',
    description: 'Membuat mockup untuk halaman landing website baru',
    dueDate: '2023-08-20',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Andi Pratama',
    tags: ['Design', 'Website']
  }, {
    id: 2,
    title: 'Mengupdate Database',
    description: 'Melakukan optimasi dan update pada database pelanggan',
    dueDate: '2023-08-18',
    priority: 'medium',
    status: 'pending',
    assignee: 'Budi Santoso',
    tags: ['Database', 'Backend']
  }, {
    id: 3,
    title: 'Testing Aplikasi Mobile',
    description: 'Melakukan pengujian pada fitur baru aplikasi mobile',
    dueDate: '2023-08-15',
    priority: 'low',
    status: 'completed',
    assignee: 'Citra Dewi',
    tags: ['Testing', 'Mobile']
  }, {
    id: 4,
    title: 'Meeting dengan Klien',
    description: 'Presentasi progress development kepada klien',
    dueDate: '2023-08-22',
    priority: 'high',
    status: 'pending',
    assignee: 'Deni Cahyadi',
    tags: ['Meeting', 'Client']
  }, {
    id: 5,
    title: 'Setup Server Baru',
    description: 'Melakukan konfigurasi pada server produksi yang baru',
    dueDate: '2023-08-17',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'Eko Prasetyo',
    tags: ['Server', 'DevOps']
  }, {
    id: 6,
    title: 'Revisi Dokumentasi API',
    description: 'Memperbarui dokumentasi API sesuai dengan perubahan terbaru',
    dueDate: '2023-08-16',
    priority: 'low',
    status: 'in-progress',
    assignee: 'Fani Wijaya',
    tags: ['Documentation', 'API']
  }] as any[];
  const calendarTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    date: task.dueDate,
    priority: task.priority
  }));


  const [visible, setVisible] = useState(false);
  const categories = ['UI/UX', 'Backend', 'Frontend', 'Dokumentasi'];

  const handleSubmit = (values: TaskFormValues) => {
    console.log('Tugas baru:', values);
    message.success('Tugas berhasil ditambahkan!');
    setVisible(false);
  };

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
        categories={categories}
      />
      </div>
      <div>
        {viewMode === 'card' && <TaskCard tasks={tasks} />}
        {viewMode === 'table' && <TaskTable tasks={tasks} />}
        {viewMode === 'calendar' && <TaskCalendar tasks={calendarTasks} />}
      </div>
    </div>;
}