// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function UserInfoPage() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     age: "",
//     height: "",
//     size: "",
//     gender: "",
//     preferences: "",
//     color: "",
//     material: "",
//     fitting: "",
//     region: "",
//   });
//   const [image, setImage] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const data = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         data.append(key, value);
//       });
//       if (image) {
//         data.append("image", image);
//       }

//       const nodeResponse = await axios.post("http://localhost:5000/api/userinfo", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const savedData = nodeResponse.data; 
//      // Step 3: Send saved data to Flask backend as JSON
//      await axios.post("http://localhost:8000/receive-userinfo", savedData, {
//        headers: {
//          "Content-Type": "application/json",
//        },
//      });

//       setIsLoading(false);
//       navigate("/login");
//     } catch (error) {
//       console.error("Error submitting user info:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
//       <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
//         <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
//           Tell Us About You
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Age</label>
//               <input
//                 name="age"
//                 type="number"
//                 placeholder="Enter your age"
//                 required
//                 value={formData.age}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
//               <input
//                 name="height"
//                 type="number"
//                 placeholder="Enter your height"
//                 required
//                 value={formData.height}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Clothing Size</label>
//               <select
//                 name="size"
//                 value={formData.size}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
//                 <option value="">Select size</option>
//                 <option value="XS">XS</option>
//                 <option value="S">S</option>
//                 <option value="M">M</option>
//                 <option value="L">L</option>
//                 <option value="XL">XL</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Gender</label>
//               <input
//                 name="gender"
//                 placeholder="e.g. Male, Female"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Preferred Color</label>
//               <input
//                 name="color"
//                 placeholder="e.g. Blue, Black"
//                 value={formData.color}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Material Preference</label>
//               <input
//                 name="material"
//                 placeholder="e.g. Cotton, Wool"
//                 value={formData.material}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Style Preferences</label>
//               <input
//                 name="preferences"
//                 placeholder="e.g. Casual, Formal, Sporty"
//                 value={formData.preferences}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Fitting</label>
//               <input
//                 name="fitting"
//                 placeholder="e.g. Loose, Body Tight"
//                 value={formData.fitting}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Region</label>
//               <input
//                 name="region"
//                 placeholder="Region where you stay"
//                 value={formData.region}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
//             </div>
//           </div>

//           <div className="md:col-span-2 mx-5 my-6">
//               <label className="block text-sm font-medium text-gray-700">Upload Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="mt-1 block w-96 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//               />
//           </div>
         

//           <div className="mt-8 px-64">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
//                 isLoading
//                   ? "bg-purple-400 cursor-not-allowed"
//                   : "bg-purple-600 hover:bg-purple-700"
//               }`}>
//               {isLoading ? "Submitting..." : "Submit Info"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    age: "",
    height: "",
    size: "",
    gender: "",
    preferences: "",
    color: "",
    material: "",
    fitting: "",
    region: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) {
        data.append("image", image);
      }

      const nodeResponse = await axios.post("http://localhost:5000/api/userinfo", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const savedData = nodeResponse.data; 
     // Step 3: Send saved data to Flask backend as JSON
     await axios.post("http://localhost:8000/receive-userinfo", savedData, {
       headers: {
         "Content-Type": "application/json",
       },
     });

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Error submitting user info:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Tell Us About You
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                name="age"
                type="number"
                placeholder="Enter your age"
                required
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                name="height"
                type="number"
                placeholder="Enter your height"
                required
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Clothing Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <input
                name="gender"
                placeholder="e.g. Male, Female"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Color</label>
              <input
                name="color"
                placeholder="e.g. Blue, Black"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material Preference</label>
              <input
                name="material"
                placeholder="e.g. Cotton, Wool"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Style Preferences</label>
              <input
                name="preferences"
                placeholder="e.g. Casual, Formal, Sporty"
                value={formData.preferences}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fitting</label>
              <input
                name="fitting"
                placeholder="e.g. Loose, Body Tight"
                value={formData.fitting}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <input
                name="region"
                placeholder="Region where you stay"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
          </div>

          <div className="md:col-span-2 mx-5 my-6">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-96 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
          </div>
         

          <div className="mt-8 px-64">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}>
              {isLoading ? "Submitting..." : "Submit Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}