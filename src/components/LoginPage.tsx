import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // added useNavigate
import { useUserStore } from "../store/useUserStore";
import { message } from "antd";
import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = useUserStore((state) => state.login);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const success = useUserStore((state) => state.success);
  const setError = useUserStore((state) => state.setError);
  const setSuccess = useUserStore((state) => state.setSuccess);

  const navigate = useNavigate(); // added navigate hook

  useEffect(() => {
    if (error) {
      const key = 'login_error';
      message.open({
        key,
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
      const key = 'login_success';
      message.open({
        key,
        type: "success",
        duration: 4,
        icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
        content: (
          <div className="text-lg">
            {success}
          </div>
        ),
      });
      setSuccess(null);
      navigate("/dashboard"); // redirect after success
    }
  }, [success, setSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-sm font-medium text-blue-700 mb-1">
              Email/Username
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-4 rounded-lg transition duration-200`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Tambahan bagian ini */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
