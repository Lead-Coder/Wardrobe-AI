import type React from "react"
import { useState } from "react"
import { useUser } from "../context/UserContext"; 
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate()
    const { setEmail } = useUser();
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    })
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
    
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
 
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", formData.email);
        setEmail(formData.email);
        alert("Login successful!");
        navigate("/recommendation");
      } catch {
        alert("An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    };
    
  
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/wardrobe.jpg')] bg-cover bg-center opacity-60 z-0" />

        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-5">
            <h1 className="text-center text-white font-bold text-lg">Login to your StyleAI account</h1>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@gmail.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  isLoading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                }`}
                disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-800">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
