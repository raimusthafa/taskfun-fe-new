import { useTaskStore } from '@/store/useTaskStore';
import { CheckCircleIcon, ClockIcon, MoreVerticalIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Dropdown, Menu, Space, type MenuProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export function TaskTable(){
  const { tasks } = useTaskStore();

  const items: MenuProps['items'] = [
  {
    label: (
    <div className='flex gap-3'>
      <EditOutlined/>
      <span>
        Edit
      </span>
    </div>
    ),
    key: '0',
  },
    {
    type: 'divider',
  },
  {
    label: (
    <div className='flex gap-3'>
      <DeleteOutlined/>
      <span>
        Hapus
      </span>
    </div>
    ),
    key: '1',
    danger: true,
  },

];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'in_progress':
        return <ClockIcon size={16} className="text-yellow-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-500" />;
    }
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tugas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenggat Waktu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioritas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task, index) => <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {task.tugas}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(task.tenggat)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.prioritas)}`}>
                    {task.prioritas.charAt(0).toUpperCase() + task.prioritas.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-50`}>
                    <span className="mr-1">{getStatusIcon(task.status)}</span>
                    {task.status === 'in_progress' ? 'Dalam Proses' : task.status === 'completed' ? 'Selesai' : 'Tertunda'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text- text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                        <Dropdown menu={{ items }} placement="bottomRight">
      <a onClick={(e) => e.preventDefault()}>
        <Space className='cursor-pointer'>
                  <MoreVerticalIcon size={16} />
        </Space>
      </a>
    </Dropdown>

                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}