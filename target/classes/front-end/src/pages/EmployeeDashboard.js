import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/dashboard/employee', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Redirect to login page
        navigate('/');
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Employee Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : dashboardData ? (
          <>
            {/* Task Statistics */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Task Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-blue-800">Assigned Tasks</h3>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.assignedTasks}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-green-800">Completed Tasks</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.completedTasks}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-yellow-800">Upcoming Deadlines</h3>
                  <p className="text-3xl font-bold text-yellow-600">{dashboardData.upcomingDeadlines}</p>
                </div>
              </div>
            </div>

            {/* Time Tracking */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Time Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-blue-800">Hours This Week</h3>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.hoursThisWeek}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-green-800">Hours Last Week</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.hoursLastWeek}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-purple-800">Overtime Hours</h3>
                  <p className="text-3xl font-bold text-purple-600">{dashboardData.overtimeHours}</p>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Recent Tasks</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentTasks.map((task, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Time Off Requests */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Time Off Requests</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.timeOffRequests.map((request, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No dashboard data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
