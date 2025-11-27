import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoardStore } from '@/store/useBoardStore';
import { useTaskStore } from '@/store/useTaskStore';
import { Button, Spin, message, Modal, Tag, Tooltip, Avatar } from 'antd';
import { ArrowLeftOutlined, EditOutlined, TeamOutlined, LockOutlined, UnlockOutlined, DeleteOutlined } from '@ant-design/icons';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import KanbanColumn from '@/components/boards/KanbanColumn';
import TaskCard from '@/components/boards/TaskCard';
import BoardModal from '@/components/boards/BoardModal';
import MemberModal from '@/components/boards/MemberModalNew';
import TaskBoardModal from '@/components/boards/TaskBoardModal';
import type { Task } from '@/types/task';

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
  }, [id]);

  useEffect(() => {
    console.log('Modal states changed:', { 
      editModalOpen, 
      memberModalOpen, 
      taskModalOpen 
    });
  }, [editModalOpen, memberModalOpen, taskModalOpen]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = currentBoard?.tasks.find((t: Task) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as 'todo' | 'in_progress' | 'done';

    const task = currentBoard?.tasks.find((t: Task) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await updateTask(taskId, { status: newStatus });
      message.success(`Task dipindahkan ke ${newStatus === 'todo' ? 'To Do' : newStatus === 'in_progress' ? 'In Progress' : 'Done'}`);
      if (id) {
        fetchBoardById(parseInt(id));
      }
    } catch (error: any) {
      message.error('Gagal memindahkan task');
    }
  };

  const handleDeleteBoard = async () => {
    try {
      if (id) {
        await deleteBoard(parseInt(id));
        message.success('Board berhasil dihapus');
        setDeleteModalOpen(false);
        navigate('/boards');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal menghapus board');
    }
  };

  if (loading && !currentBoard) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Memuat board..." />
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <p className="text-gray-500 mb-4">Board tidak ditemukan</p>
        <Button type="primary" onClick={() => navigate('/boards')}>
          Kembali ke Boards
        </Button>
      </div>
    );
  }

  const { board, members, tasks } = currentBoard;

  const todoTasks = tasks.filter((t: Task) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t: Task) => t.status === 'done');

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/boards')}
          className="mb-3"
        >
          Kembali ke Boards
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{board.title}</h1>
              <Tag
                icon={board.visibility === 'public' ? <UnlockOutlined /> : <LockOutlined />}
                color={board.visibility === 'public' ? 'blue' : 'green'}
              >
                {board.visibility === 'public' ? 'Public' : 'Private'}
              </Tag>
            </div>
            <p className="text-gray-500">{board.description || 'Tidak ada deskripsi'}</p>
          </div>

          <div className="flex gap-2">
            <Tooltip title="Kelola Member">
              <Button
                type="default"
                icon={<TeamOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Opening member modal...');
                  setMemberModalOpen(true);
                }}
              >
                {members.length} Member{members.length !== 1 ? 's' : ''}
              </Button>
            </Tooltip>
            <Tooltip title="Edit Board">
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditModalOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Hapus Board">
              <Button
                type="default"
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteModalOpen(true);
                }}
              />
            </Tooltip>
          </div>
        </div>

        {/* Members Preview */}
        <div className="flex items-center gap-2 mt-4">
          <Avatar.Group maxCount={5}>
            {members.map((member) => (
              <Tooltip key={member.id_boardmember} title={member.user?.fullname || `User ${member.id_user}`}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {(member.user?.fullname || `U${member.id_user}`).charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
          <span className="text-sm text-gray-500">Board Members</span>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
          <KanbanColumn
            id="todo"
            title="To Do"
            count={todoTasks.length}
            tasks={todoTasks}
            color="#faad14"
            onAddTask={() => setTaskModalOpen(true)}
          />
          <KanbanColumn
            id="in_progress"
            title="In Progress"
            count={inProgressTasks.length}
            tasks={inProgressTasks}
            color="#1890ff"
            onAddTask={() => setTaskModalOpen(true)}
          />
          <KanbanColumn
            id="done"
            title="Done"
            count={doneTasks.length}
            tasks={doneTasks}
            color="#52c41a"
            onAddTask={() => setTaskModalOpen(true)}
          />
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
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
        onClose={() => {
          console.log('MemberModal onClose called');
          setMemberModalOpen(false);
        }}
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
        title="Hapus Board"
        open={deleteModalOpen}
        onOk={handleDeleteBoard}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Hapus"
        cancelText="Batal"
        okType="danger"
        confirmLoading={loading}
      >
        <p>
          Apakah Anda yakin ingin menghapus board <strong>{board.title}</strong>?
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Semua data board termasuk tasks akan hilang dan tidak dapat dikembalikan.
        </p>
      </Modal>
    </div>
  );
}
