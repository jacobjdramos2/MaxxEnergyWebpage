import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EngineerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/dashboard/engineer', {
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
          <h1 className="text-3xl font-bold text-green-800">Engineer Dashboard</h1>
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
            {/* Project Statistics */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Project Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-blue-800">Active Projects</h3>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.activeProjects}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-green-800">Completed Projects</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.completedProjects}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-yellow-800">Upcoming Deadlines</h3>
                  <p className="text-3xl font-bold text-yellow-600">{dashboardData.upcomingDeadlines}</p>
                </div>
              </div>
            </div>

            {/* Equipment Status */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Equipment Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-green-800">Operational</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.equipmentStatus.operational}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-yellow-800">Maintenance</h3>
                  <p className="text-3xl font-bold text-yellow-600">{dashboardData.equipmentStatus.maintenance}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-red-800">Offline</h3>
                  <p className="text-3xl font-bold text-red-600">{dashboardData.equipmentStatus.offline}</p>
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Recent Documents</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentDocuments.map((doc, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{doc.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.lastUpdated}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.updatedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Maintenance */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Upcoming Maintenance</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.upcomingMaintenance.map((maintenance, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{maintenance.equipment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maintenance.scheduledDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maintenance.assignedTo}</td>
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

export default EngineerDashboard;
