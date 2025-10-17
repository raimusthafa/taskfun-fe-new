import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import { 
  CalendarIcon, 
  ClockIcon, 
  FlagIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  UsersIcon 
} from 'lucide-react';
import { Spin, message, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';
import InviteCollaboratorModal from '@/components/tasks/InviteCollaboratorModal';
import InviteList from '@/components/tasks/InviteList';
import type { Task } from '@/types/task';

export default function DetailTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (!id) return;
        const taskData = await getTaskById(id);
        if (taskData) {
          setTask(taskData);
        } else {
          message.error('Tugas tidak ditemukan');
          navigate('/tugas');
        }
      } catch (error) {
        console.error('Error loading task:', error);
        message.error('Gagal memuat detail tugas');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, getTaskById, navigate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in_progress':
        return 'Dalam Proses';
      default:
        return 'Tertunda';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button and Actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/tugas')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali ke Daftar Tugas
          </button>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsInviteModalOpen(true)}
          >
            Undang Kolaborator
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">{task.tugas}</h1>
          </div>

          <div className="p-6">
            {/* Task Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Priority */}
              <div className="flex items-start space-x-3">
                <FlagIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Prioritas</p>
                  <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.prioritas)}`}>
                    {task.prioritas.charAt(0).toUpperCase() + task.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-start space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Tenggat Waktu</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(task.tenggat)}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                    {task.status === 'done' && <CheckCircleIcon className="w-4 h-4 mr-1.5" />}
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Deskripsi</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{task.deskripsi || 'Tidak ada deskripsi'}</p>
              </div>
            </div>

            {/* Collaborators */}
            <div className="border-t border-gray-200 pt-8">
              <InviteList taskId={id || ''} />
            </div>
          </div>
        </div>

        {/* Invite Collaborator Modal */}
        <InviteCollaboratorModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          taskId={id || ''}
          onInviteSuccess={() => {
            message.success('Kolaborator berhasil diundang');
          }}
        />
      </div>
    </div>
  );
}