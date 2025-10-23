import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import {
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { Spin, message, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';
import InviteCollaboratorModal from '@/components/tasks/InviteCollaboratorModal';
import InviteList from '@/components/tasks/InviteList';
import type { Task } from '@/types/task';
import { motion } from 'framer-motion';

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
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/tugas')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali ke Daftar
          </button>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Undang Kolaborator
          </Button>
        </div>

        {/* Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden"
        >
          {/* Title */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
            <h1 className="text-3xl font-semibold text-gray-900">{task.tugas}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Detail dan progres dari tugas ini
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start gap-3">
                <FlagIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Prioritas</p>
                  <span
                    className={`mt-1 text-xs font-medium px-2 py-1 rounded ${getPriorityColor(
                      task.prioritas
                    )}`}
                  >
                    {task.prioritas.charAt(0).toUpperCase() +
                      task.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Tenggat Waktu</p>
                  <p className="mt-1 text-gray-900 font-medium">
                    {formatDate(task.tenggat)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`mt-1 text-xs font-medium px-2 py-1 rounded ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status === 'done' && (
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                    )}
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Deskripsi
              </h3>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {task.deskripsi || 'Tidak ada deskripsi.'}
                </p>
              </div>
            </div>

            {/* Kolaborator */}
            <div className="pt-6 border-t border-gray-100">
              <InviteList taskId={id || ''} />
            </div>
          </div>
        </motion.div>

        {/* Modal */}
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
