import React, { useState } from "react";
import DashboardLayout from "../components/dashboard";
import shirt3 from "../assets/shirt/26792.jpg";
import shirt4 from "../assets/shirt/33249.jpg";
import tshirt1 from "../assets/tshirt/10866.jpg";
import tshirt2 from "../assets/tshirt/12200.jpg";
import kurta1 from "../assets/kurta/30755.jpg";
import kurta2 from "../assets/kurta/56704.jpg";
import jeans1 from "../assets/jeans/11340.jpg";
import jeans2 from "../assets/jeans/11348.jpg";

const dummyRecommendations = [
  {
    type: "Shirt",
    image: shirt4,
    description: "Classic white shirt, perfect for formal occasions."
  },
  {
    type: "Jeans",
    image: jeans1,
    description: "Slim fit black pants for a sleek look."
  },
  {
    type: "T-Shirt",
    image: tshirt1,
    description: "Casual T-shirt for everyday comfort."
  },
  {
    type: "Kurta",
    image: kurta1,
    description: "Traditional kurta for ethnic events."
  },
  {
    type: "Jeans",
    image: jeans2,
    description: "Blue denim jeans, classic and timeless."
  },
  {
    type: "Kurta",
    image: kurta2,
    description: "Ethnic kurta for traditional events."
  }
];

const Recommendations: React.FC = () => {
  const [showData, setShowData] = useState(false);

  const fetchDummyData = () => {
    setShowData(true);
  };

  return (
    <DashboardLayout>
      <div className="bg-white shadow-md rounded-2xl p-3 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">✨ Your Outfit Recommendations</h2>

        <button
          className="mb-6 ml-16 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          onClick={fetchDummyData}>Show Recommendations
        </button>

        {!showData ? (
          <div className="text-center text-gray-500">Click the button to view outfit suggestions.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dummyRecommendations.map((item, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-purple-50 p-3">
                <img
                  src={item.image}
                  alt={item.type}
                  className="w-full h-64 object-cover rounded-md"
                />
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-purple-700">{item.type}</h3>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
