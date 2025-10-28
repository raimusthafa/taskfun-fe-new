import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X } from 'lucide-react';
import { message } from 'antd';

const Profile = () => {
  const { user, loading, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    username: user?.username || '',
    profilepic: user?.profilepic || '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        profilepic: user.profilepic,
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
    try {
    e.preventDefault();
    if (!user) return;

    await updateUser(user.id_user, {
      fullname: profileData.fullname,
      email: profileData.email,
      username: profileData.username,
      profilepic: profileData.profilepic,
      password: "" // ❗ Kalau tidak mau ganti password, kosongkan
    });
    message.success('Profile berhasil diupdate!');
  } catch (error) {
    message.error('Gagal update profile');
  }

    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setProfileData(prev => ({
      ...prev,
      profilepic: reader.result as string  // base64 string
    }));
  };
  reader.readAsDataURL(file);
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
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={user?.profilepic || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                  <Camera size={20} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
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
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
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
      </motion.div>
    </div>
  );
};

export default Profile;
