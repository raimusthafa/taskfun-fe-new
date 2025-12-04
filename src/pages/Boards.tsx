import { useEffect, useState } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { Button, Card, Empty, Spin, message, Modal, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BoardModal from '@/components/boards/BoardModal';
import type { Board } from '@/types/board';

export default function Boards() {
  const navigate = useNavigate();
  const { boards, loading, fetchBoards, deleteBoard } = useBoardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = () => {
    setEditingBoard(null);
    setIsModalOpen(true);
  };

  const handleEditBoard = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBoard(board);
    setIsModalOpen(true);
  };

  const handleDeleteBoard = (boardId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Hapus Board',
      content: 'Apakah Anda yakin ingin menghapus board ini? Semua data akan hilang.',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await deleteBoard(boardId);
          message.success('Board berhasil dihapus');
        } catch (error: any) {
          message.error(error.response?.data?.error || 'Gagal menghapus board');
        }
      },
    });
  };

  const handleViewBoard = (boardId: number) => {
    navigate(`/boards/${boardId}`);
  };

  if (loading && boards.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Memuat boards..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Boards</h1>
          <p className="text-gray-500 mt-1">Kelola boards dan tim Anda</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateBoard}
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          Buat Board Baru
        </Button>
      </div>

      {/* Board Grid */}
      {boards.length === 0 ? (
        <Empty
          description={
            <div className="text-center">
              <p className="text-gray-500 mb-4">Belum ada board yang dibuat</p>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateBoard}>
                Buat Board Pertama
              </Button>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card
              key={board.id_board}
              hoverable
              className="shadow-md hover:shadow-xl transition-all duration-300 border-t-4"
              style={{ 
                borderTopColor: board.visibility === 'public' ? '#1890ff' : '#52c41a',
              }}
              onClick={() => handleViewBoard(board.id_board)}
              actions={[
                <Tooltip title="Lihat Detail">
                  <EyeOutlined key="view" onClick={() => handleViewBoard(board.id_board)} />
                </Tooltip>,
                <Tooltip title="Edit Board">
                  <EditOutlined key="edit" onClick={(e) => handleEditBoard(board, e)} />
                </Tooltip>,
                <Tooltip title="Hapus Board">
                  <DeleteOutlined
                    key="delete"
                    onClick={(e) => handleDeleteBoard(board.id_board, e)}
                    className="text-red-500 hover:text-red-700"
                  />
                </Tooltip>,
              ]}
            >
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 truncate flex-1">
                    {board.title}
                  </h3>
                  <Tag
                    icon={board.visibility === 'public' ? <UnlockOutlined /> : <LockOutlined />}
                    color={board.visibility === 'public' ? 'blue' : 'green'}
                  >
                    {board.visibility === 'public' ? 'Public' : 'Private'}
                  </Tag>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {board.description || 'Tidak ada deskripsi'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <TeamOutlined />
                    Board Team
                  </span>
                  <span>
                    {new Date(board.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Board Modal */}
      <BoardModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBoard(null);
        }}
        board={editingBoard}
      />
    </div>
  );
}
