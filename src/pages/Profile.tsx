import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, loading, error } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname,
        email: user.email,
        username: user.username,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={user?.profilepic || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                  <Camera size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900"
              >
                {user?.fullname}
              </motion.h1>
              <p className="text-gray-500">@{user?.username}</p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-lg mx-auto"
            >
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Profile Fields */}
                  {Object.entries(profileData).map(([key, value]) => (
                    <div key={key} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key}
                      </label>
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`
                          w-full px-4 py-2 rounded-lg border
                          ${isEditing 
                            ? 'border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'}
                          transition-all duration-200
                        `}
                      />
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-8">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X size={18} className="mr-2" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Edit2 size={18} className="mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">18</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">In Progress</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">6</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;