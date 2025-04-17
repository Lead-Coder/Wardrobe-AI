import React from "react";
import { Link } from "react-router-dom";
import image1 from "../assets/cloth1.jpg"
import image2 from "../assets/cloth2.jpg"
import image3 from "../assets/cloth3.jpg"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 text-gray-800 font-sans">
      <header className="opacity-75 bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">MyStylist AI</h1>
          <nav className="space-x-6 text-sm md:text-base">
            <Link to="/" className="hover:text-blue-100 transition">About</Link>
            <Link to="/login" className="hover:text-blue-100 transition">Login</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-6 md:px-12 lg:px-24 text-center bg-white">
        <h2 className="text-9xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">
          Your AI-Powered Personal Stylist
        </h2>
        <p className="mt-3 text-xl text-gray-700 max-w-2xl mx-auto">
          Say goodbye to wardrobe paralysis! MyStylist helps you get dressed confidently every day with intelligent outfit suggestions tailored just for you.
        </p>
      </section>

      <section className="py-16 bg-white px-6 md:px-12 lg:px-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Tailored Recommendations</h3>
            <p className="text-gray-600">
              Our AI learns your unique body shape, preferences, and daily routines to create stylish outfit suggestions that suit your lifestyle.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={image1}
              alt="Outfit suggestion"
              className="w-full h-64 object-cover"/>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="rounded-xl overflow-hidden shadow-md md:order-2">
            <img
              src={image2}
              alt="Style Match"
              className="w-full h-64 object-cover"/>
          </div>
          <div className="md:order-1">
            <h3 className="text-2xl font-semibold text-pink-600 mb-3">Smart Matching Algorithms</h3>
            <p className="text-gray-600">
              Get outfit ideas that match your existing wardrobe while evolving with your taste over time.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Virtual Closet</h3>
            <p className="text-gray-600">
              Upload your wardrobe items and see virtual combinations with ease. Stay organized, and maximize your fashion potential.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={image3}
              alt="Virtual closet"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-pink-500 text-white text-center py-6 mt-16">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyStylist AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
