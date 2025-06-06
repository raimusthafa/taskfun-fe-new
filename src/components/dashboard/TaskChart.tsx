export function TaskChart() {
  // This is a simplified chart representation
  // In a real app, you would use a charting library
  const chartData = [{
    day: 'Sen',
    completed: 4,
    pending: 2
  }, {
    day: 'Sel',
    completed: 5,
    pending: 3
  }, {
    day: 'Rab',
    completed: 7,
    pending: 1
  }, {
    day: 'Kam',
    completed: 3,
    pending: 5
  }, {
    day: 'Jum',
    completed: 6,
    pending: 2
  }, {
    day: 'Sab',
    completed: 2,
    pending: 1
  }, {
    day: 'Min',
    completed: 1,
    pending: 0
  }];
  const maxValue = Math.max(...chartData.map(item => item.completed + item.pending));
  return <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Aktivitas Mingguan</h3>
      <div className="flex items-end h-60 space-x-6">
        {chartData.map((item, index) => {
        const completedHeight = item.completed / maxValue * 100;
        const pendingHeight = item.pending / maxValue * 100;
        return <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col-reverse h-48">
                <div className="bg-green-500 rounded-t-sm w-full" style={{
              height: `${completedHeight}%`
            }}></div>
                <div className="bg-yellow-400 rounded-t-sm w-full" style={{
              height: `${pendingHeight}%`
            }}></div>
              </div>
              <div className="text-xs font-medium text-gray-500 mt-2">
                {item.day}
              </div>
            </div>;
      })}
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Selesai</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Dalam Proses</span>
        </div>
      </div>
    </div>;
}