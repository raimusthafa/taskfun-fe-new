import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { message } from "antd";
import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';

const Register: React.FC = () => {
  const [username, setUserName] = useState<string>("");
  const [fullname, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const register = useUserStore((state) => state.register);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const success = useUserStore((state) => state.success);
  const setError = useUserStore((state) => state.setError);
const setSuccess = useUserStore((state) => state.setSuccess);


  useEffect(() => {
    if (error) {
      message.open({
  type: "error",
  duration: 4,
  icon: <CloseCircleOutlined twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
  content: (
    <div className="text-lg">
      {error}
    </div>
  ),
  });
      setError(null);
    }
  }, [error, setError]);

useEffect(() => {
  if (success) {
    message.open({
  type: "success",
  duration: 4,
  icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
  content: (
    <div className="text-lg">
      {success}
    </div>
  ),
});

    // ✅ Reset semua input
    setUserName("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setSuccess(null);
  }
}, [success, setSuccess]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      message.open({
  type: "error",
  duration: 4,
  icon: <CloseCircleOutlined twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
  content: (
    <div className="text-lg">
      Password dan konfirmasi tidak sama!
    </div>
  ),
  });
      return;
    }
    await register(username, fullname, email, password);
  };

  // New handlers for test buttons
//   const handleTestSuccess = () => {
// message.open({
//   type: "success",
//   duration: 4,
//   icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
//   content: (
//     <div className="text-lg">
//       Yeay! Registrasi berhasil 🎉
//     </div>
//   ),
// });
//   };

//   const handleTestError = () => {
// message.open({
//   type: "error",
//   duration: 4,
//   icon: <CloseCircleOutlined twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
//   content: (
//     <div className="text-lg">
//       Username sudah digunakan.
//     </div>
//   ),
//   });
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-blue-700 mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-blue-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-4 rounded-lg transition duration-200`}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        {/* Test message buttons */}
        {/* <div className="mt-4 flex justify-between gap-4">
          <button
            type="button"
            onClick={handleTestSuccess}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Test Success Message
          </button>
          <button
            type="button"
            onClick={handleTestError}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Test Error Message
          </button>
        </div> */}

        {/* Tambahan bagian ini */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
