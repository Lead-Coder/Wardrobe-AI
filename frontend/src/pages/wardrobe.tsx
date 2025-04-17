import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard";

import shirt1 from "../assets/shirt/11108.jpg";
import shirt2 from "../assets/shirt/15970.jpg";
import shirt3 from "../assets/shirt/26792.jpg";
import shirt4 from "../assets/shirt/33249.jpg";
import tshirt1 from "../assets/tshirt/10866.jpg";
import tshirt2 from "../assets/tshirt/12200.jpg";
import tshirt3 from "../assets/tshirt/53759.jpg";
import tshirt4 from "../assets/tshirt/53762.jpg";
import kurta1 from "../assets/kurta/30755.jpg";
import kurta2 from "../assets/kurta/56704.jpg";
import kurta3 from "../assets/kurta/56703.jpg";
import kurta4 from "../assets/kurta/56702.jpg";
import jeans1 from "../assets/jeans/11340.jpg";
import jeans2 from "../assets/jeans/11348.jpg";
import jeans3 from "../assets/jeans/42258.jpg";
import jeans4 from "../assets/jeans/43487.jpg";

interface ClothingItem {
  id: number;
  name: string;
  image: string;
  color: string;
  brand?: string;
  occasions?: string[];
}

interface ClothingCategoryProps {
  title: string;
  items: ClothingItem[];
  colorClass: string;
  gradientFrom: string;
  gradientTo: string;
}

const ClothingCategory: React.FC<ClothingCategoryProps> = ({ 
  title, 
  items, 
  colorClass,
  gradientFrom,
  gradientTo
}) => {
  return (
    <section className="mb-12">
      <h3 className={`text-2xl font-semibold mb-4 ${colorClass}`}>{title}</h3>

      <div className="relative">
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x">
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex-none w-64 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition snap-start"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-lg">{item.name}</h4>
                <p className="text-gray-500">Color: {item.color}</p>
                {item.occasions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.occasions.map((occasion, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600">
                        {occasion}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function WardrobePage() {
  const shirts: ClothingItem[] = [
    { id: 1, name: "Checkered Gray Shirt", image: shirt1, color: "Gray", brand: "Gap", occasions: ["Casual", "Office"] },
    { id: 2, name: "Blue Plaid Shirt", image: shirt2, color: "Blue", brand: "H&M", occasions: ["Formal", "Office"] },
    { id: 3, name: "Light Blue Dress Shirt", image: shirt3, color: "Light Blue", brand: "Lacoste", occasions: ["Casual", "Sports"] },
    { id: 4, name: "Striped Dress Shirt", image: shirt4, color: "Blue/White", brand: "Zara", occasions: ["Casual"] },
  ];

  const tshirts: ClothingItem[] = [
    { id: 1, name: "Red Graphic Tee", image: tshirt1, color: "Red", brand: "Uniqlo", occasions: ["Casual", "Everyday"] },
    { id: 2, name: "Red Polo Shirt", image: tshirt2, color: "Red", brand: "Gap", occasions: ["Casual"] },
    { id: 3, name: "Gray Polo Shirt", image: tshirt3, color: "Gray", brand: "H&M", occasions: ["Casual", "Outing"] },
    { id: 4, name: "Red Navy Striped Polo", image: tshirt4, color: "Red/Navy", brand: "Old Navy", occasions: ["Casual"] },
  ];

  const kurtas: ClothingItem[] = [
    { id: 1, name: "Purple Kurta", image: kurta1, color: "Purple", brand: "Fabindia", occasions: ["Festival", "Traditional"] },
    { id: 2, name: "Red Kurta", image: kurta2, color: "Red", brand: "Manyavar", occasions: ["Casual", "Traditional"] },
    { id: 3, name: "Cream Kurta", image: kurta3, color: "Cream", brand: "Anita Dongre", occasions: ["Wedding", "Festival"] },
    { id: 4, name: "Blue-Gray Kurta", image: kurta4, color: "Blue-Gray", brand: "Global Desi", occasions: ["Casual", "Traditional"] },
  ];

  const jeans: ClothingItem[] = [
    { id: 1, name: "Classic Blue Jeans", image: jeans1, color: "Blue", brand: "Levi's", occasions: ["Casual", "Everyday"] },
    { id: 2, name: "Dark Denim Jeans", image: jeans2, color: "Dark Blue", brand: "Dockers", occasions: ["Smart casual", "Office"] },
    { id: 3, name: "Light Wash Jeans", image: jeans3, color: "Light Blue", brand: "Calvin Klein", occasions: ["Formal", "Business"] },
    { id: 4, name: "Distressed Jeans", image: jeans4, color: "Blue", brand: "Gap", occasions: ["Casual", "Summer"] },
  ];

  const outfitSuggestions = [
    {
      name: "Today's Look",
      items: "Light Blue Dress Shirt + Dark Denim Jeans",
      occasion: "Office Casual"
    },
    {
      name: "Evening Out",
      items: "Red Polo Shirt + Classic Blue Jeans",
      occasion: "Dinner Date"
    },
    {
      name: "Weekend Style",
      items: "Red Graphic Tee + Light Wash Jeans",
      occasion: "Casual Outing"
    }
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 text-gray-800 font-sans">
      <header className="opacity-75 bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">MyStylist AI</h1>
          <nav className="space-x-6 text-sm md:text-base">
            <Link to="/" className="hover:text-blue-100 transition">About</Link>
            <Link to="/dashboard" className="hover:text-blue-100 transition">Dashboard</Link>
            <Link to="/logout" className="hover:text-blue-100 transition">Logout</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">
            My Wardrobe
          </h2>
        </div>

        <ClothingCategory title="Shirts" items={shirts} colorClass="text-blue-700" gradientFrom="blue-500" gradientTo="blue-600" />
        <ClothingCategory title="T-Shirts" items={tshirts} colorClass="text-indigo-600" gradientFrom="indigo-500" gradientTo="indigo-600" />
        <ClothingCategory title="Kurtas" items={kurtas} colorClass="text-purple-600" gradientFrom="purple-500" gradientTo="purple-600" />
        <ClothingCategory title="Jeans" items={jeans} colorClass="text-pink-600" gradientFrom="pink-500" gradientTo="pink-600" />

        <section className="mb-12 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Suggested Outfits</h3>
          <p className="text-gray-600 mb-4">
            Based on your wardrobe and preferences, here are some outfit ideas for you:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {outfitSuggestions.map((outfit, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition">
                <p className="font-medium text-blue-800">{outfit.name}</p>
                <p className="text-gray-700">{outfit.items}</p>
                <p className="text-xs text-gray-500 mt-2">Perfect for: {outfit.occasion}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition shadow">
              Get More Suggestions
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-pink-500 text-white text-center py-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyStylist AI. All rights reserved.</p>
      </footer>
    </div>
    </DashboardLayout>
  );
}