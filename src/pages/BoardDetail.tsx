import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoardStore } from '@/store/useBoardStore';
import { useTaskStore } from '@/store/useTaskStore';
import { Button, Spin, Modal, Tooltip, Avatar } from 'antd';
import {
  ArrowLeft,
  Users,
  Edit3,
  Trash2,
  Lock,
  Globe,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import KanbanColumn from '@/components/boards/KanbanColumn';
import TaskCard from '@/components/boards/TaskCard';
import BoardModal from '@/components/boards/BoardModal';
import MemberModal from '@/components/boards/MemberModalNew';
import TaskBoardModal from '@/components/boards/TaskBoardModal';
import type { Task } from '@/types/task';
import { toast } from '@/lib/toast';

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBoard, loading, fetchBoardById, clearCurrentBoard, deleteBoard } = useBoardStore();
  const { updateTask } = useTaskStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (id) {
      fetchBoardById(parseInt(id));
    }
    return () => {
      clearCurrentBoard();
    };
  }, [id, fetchBoardById, clearCurrentBoard]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = currentBoard?.tasks.find((t: Task) => String(t.id) === String(event.active.id));
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id || !currentBoard) return;

    const taskId = String(active.id);
    let newStatus: 'todo' | 'in_progress' | 'done' | null = null;

    // Cek apakah target drop adalah ID kolom langsung
    if (['todo', 'in_progress', 'done'].includes(String(over.id))) {
      newStatus = over.id as 'todo' | 'in_progress' | 'done';
    } else {
      // Jika di-drop di atas task lain, ambil status task tersebut
      const overTask = currentBoard.tasks.find((t: Task) => String(t.id) === String(over.id));
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (!newStatus) return;

    const currentTask = currentBoard.tasks.find((t: Task) => String(t.id) === taskId);
    if (!currentTask || currentTask.status === newStatus) return;

    // Optimistic Update: seketika pindahkan task di local state board untuk 0 delay
    const previousBoard = currentBoard;
    const updatedTasks = currentBoard.tasks.map((t: Task) =>
      String(t.id) === taskId ? { ...t, status: newStatus! } : t
    );

    useBoardStore.setState({
      currentBoard: { ...currentBoard, tasks: updatedTasks },
    });

    try {
      await updateTask(taskId, { status: newStatus });
      const statusLabel =
        newStatus === 'todo' ? 'To Do' : newStatus === 'in_progress' ? 'In Progress' : 'Done';
      toast.success(`Tugas dipindahkan ke ${statusLabel}`);
    } catch (error) {
      // Rollback state jika request gagal
      useBoardStore.setState({ currentBoard: previousBoard });
      toast.error(error, 'Gagal memindahkan tugas');
    }
  };

  const handleDeleteBoard = async () => {
    try {
      if (id) {
        await deleteBoard(parseInt(id));
        toast.success('Board berhasil dihapus');
        setDeleteModalOpen(false);
        navigate('/boards');
      }
    } catch (error) {
      toast.error(error, 'Gagal menghapus board');
    }
  };

  if (loading && !currentBoard) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Spin size="large" />
        <p className="text-gray-400 text-sm font-medium">Memuat papan tugas...</p>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <p className="text-gray-500 mb-4 font-medium">Papan tugas tidak ditemukan atau telah dihapus.</p>
        <Button type="primary" onClick={() => navigate('/boards')} className="rounded-lg shadow-sm">
          Kembali ke Daftar Boards
        </Button>
      </div>
    );
  }

  const { board, members, tasks } = currentBoard;

  const todoTasks = tasks.filter((t: Task) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t: Task) => t.status === 'done');

  const totalTasks = tasks.length;
  const completedTasks = doneTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      {/* Header Container */}
      <div className="mb-6 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        {/* Top Bar: Back & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
          <button
            onClick={() => navigate('/boards')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Boards</span>
          </button>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setTaskModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tugas</span>
            </button>

            <button
              onClick={() => setMemberModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 shadow-2xs transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-gray-500" />
              <span>{members.length} Anggota</span>
            </button>

            <Tooltip title="Edit Board">
              <button
                onClick={() => setEditModalOpen(true)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-2xs transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </Tooltip>

            <Tooltip title="Hapus Board">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 shadow-2xs transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Board Title & Description */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {board.title}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  board.visibility === 'public'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {board.visibility === 'public' ? (
                  <>
                    <Globe className="w-3 h-3" />
                    Publik
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    Privat
                  </>
                )}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
              {board.description || 'Tidak ada deskripsi pada papan tugas ini.'}
            </p>
          </div>

          {/* Progress & Member Preview */}
          <div className="flex items-center gap-6 self-start lg:self-center shrink-0">
            {/* Progress Mini Card */}
            <div className="bg-gray-50/90 rounded-xl border border-gray-200/80 p-3 min-w-[200px]">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-gray-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Progres
                </span>
                <span className="font-bold text-gray-900">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {completedTasks} dari {totalTasks} tugas selesai
              </p>
            </div>

            {/* Member Avatars */}
            <div className="hidden sm:flex flex-col items-start gap-1">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Anggota
              </span>
              <Avatar.Group maxCount={4} size="small">
                {members.map((member) => (
                  <Tooltip
                    key={member.id_boardmember}
                    title={member.user?.fullname || member.user?.username || `User ${member.id_user}`}
                  >
                    <Avatar className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-semibold text-xs border-2 border-white shadow-2xs">
                      {(member.user?.fullname || member.user?.username || 'U').charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[520px]">
          <KanbanColumn
            id="todo"
            title="To Do"
            count={todoTasks.length}
            tasks={todoTasks}
            color="#f59e0b"
            onAddTask={() => setTaskModalOpen(true)}
          />
          <KanbanColumn
            id="in_progress"
            title="In Progress"
            count={inProgressTasks.length}
            tasks={inProgressTasks}
            color="#3b82f6"
            onAddTask={() => setTaskModalOpen(true)}
          />
          <KanbanColumn
            id="done"
            title="Done"
            count={doneTasks.length}
            tasks={doneTasks}
            color="#10b981"
            onAddTask={() => setTaskModalOpen(true)}
          />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="w-[320px] max-w-full">
              <TaskCard task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <BoardModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        board={board}
      />

      <MemberModal
        open={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        boardId={board.id_board}
        members={members}
        onMemberAdded={() => {
          if (id) {
            fetchBoardById(parseInt(id));
          }
        }}
      />

      <TaskBoardModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        boardId={board.id_board}
        onSuccess={() => {
          if (id) {
            fetchBoardById(parseInt(id));
          }
        }}
      />

      {/* Delete Board Modal */}
      <Modal
        title="Hapus Papan Tugas"
        open={deleteModalOpen}
        onOk={handleDeleteBoard}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Hapus"
        cancelText="Batal"
        okType="danger"
        confirmLoading={loading}
      >
        <p className="text-gray-700">
          Apakah Anda yakin ingin menghapus board <strong>"{board.title}"</strong>?
        </p>
        <p className="text-gray-500 text-xs mt-2 bg-red-50 p-2.5 rounded-lg border border-red-100 leading-relaxed">
          ⚠️ Semua data pada papan ini termasuk daftar tugas di dalamnya akan terhapus dan tidak dapat dikembalikan.
        </p>
      </Modal>
    </div>
  );
}
