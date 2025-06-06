import { TaskView } from '../components/tasks/TaskView';

export default function Tugas() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Daftar Tugas</h1>
      <TaskView />
    </div>
  );
}
