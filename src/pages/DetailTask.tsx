import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import { useUserStore } from '@/store/useUserStore';
import {
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  Users,
  UserCheck,
} from 'lucide-react';
import { Spin, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';
import InviteCollaboratorModal from '@/components/tasks/InviteCollaboratorModal';
import InviteList from '@/components/tasks/InviteList';
import type { Task } from '@/types/task';
import { motion } from 'framer-motion';
import { toast } from '@/lib/toast';

export default function DetailTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById } = useTaskStore();
  const { user: currentUser } = useUserStore();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Periksa apakah user yang sedang login adalah pemilik tugas
  const currentUserId = currentUser?.id_user
    ? Number(currentUser.id_user)
    : currentUser?.id
    ? Number(currentUser.id)
    : undefined;
  const isOwner = Boolean(
    currentUserId !== undefined &&
      task !== null &&
      Number(task.id_user) === currentUserId
  );

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (!id) return;
        const taskData = await getTaskById(id);
        if (taskData) {
          setTask(taskData);
        } else {
          toast.error('Tugas tidak ditemukan');
          navigate('/tugas');
        }
      } catch (error) {
        console.error('Error loading task:', error);
        toast.error('Gagal memuat detail tugas');
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
      case 'done':
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
      case 'done':
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
            className="flex items-center text-gray-600 hover:text-gray-900 transition-all font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali ke Daftar
          </button>

          {isOwner ? (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsInviteModalOpen(true)}
              className="rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Undang Kolaborator
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Mode Kolaborator</span>
            </div>
          )}
        </div>

        {/* Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-gray-100"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <FlagIcon className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Prioritas</p>
                  <span
                    className={`mt-1 inline-block text-xs font-medium px-2 py-1 rounded ${getPriorityColor(
                      task.prioritas
                    )}`}
                  >
                    {task.prioritas.charAt(0).toUpperCase() +
                      task.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tenggat Waktu</p>
                  <p className="mt-1 text-gray-900 font-medium text-sm">
                    {formatDate(task.tenggat)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`mt-1 inline-flex items-center text-xs font-medium px-2 py-1 rounded ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status === 'done' && (
                      <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                    )}
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Pemilik Tugas</p>
                  <p className="mt-1 text-gray-900 font-medium text-sm">
                    {task.user?.fullname || task.user?.username || (isOwner ? 'Anda' : 'Pemilik Tugas')}
                  </p>
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

            {/* Kolaborator Section */}
            <div className="pt-6 border-t border-gray-100">
              {isOwner ? (
                <InviteList taskId={id || ''} />
              ) : (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Informasi Kolaborasi
                  </h3>
                  <div className="bg-gradient-to-br from-indigo-50/60 to-blue-50/60 border border-indigo-100 rounded-xl p-5">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {(task.user?.fullname || task.user?.username || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {task.user?.fullname || task.user?.username || 'Pemilik Tugas'}
                          </h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-700">
                            Pemilik Tugas
                          </span>
                        </div>
                        {task.user?.email && (
                          <p className="text-xs text-gray-500 mt-0.5">{task.user.email}</p>
                        )}
                        <p className="text-xs text-gray-600 mt-2.5 bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-indigo-100/80 leading-relaxed">
                          Anda mengakses tugas ini sebagai <strong>kolaborator</strong> yang diundang. Hak akses untuk mengelola atau mengundang kolaborator baru hanya dimiliki oleh pemilik tugas.
                        </p>
                      </div>
                    </div>

                    {task.collaborators && task.collaborators.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-indigo-100/70">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Kolaborator yang Bergabung ({task.collaborators.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {task.collaborators.map((c) => (
                            <span
                              key={c.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-indigo-100 shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {c.fullname || c.username}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modal hanya untuk Owner */}
        {isOwner && (
          <InviteCollaboratorModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            taskId={id || ''}
          />
        )}
      </div>
    </div>
  );
}
