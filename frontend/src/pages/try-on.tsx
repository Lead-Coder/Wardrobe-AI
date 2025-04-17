import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/dashboard";

// Import the images directly
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

interface TryOnOption {
  id: string;
  thumbnail: string;
  name: string;
  category: string;
  color: string;
}

export default function TryOnPage() {
  const [selectedItems, setSelectedItems] = useState<TryOnOption[]>([]);
  const [tryOnImages, setTryOnImages] = useState<TryOnOption[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load clothing items from your imported image variables
  useEffect(() => {
    // Use the imported image variables instead of static paths
    const clothingItems: TryOnOption[] = [
      // T-shirts
      {
        id: "tshirt-1",
        thumbnail: tshirt1,
        name: "Classic T-Shirt",
        category: "tops",
        color: "#ff0000"
      },
      {
        id: "tshirt-2",
        thumbnail: tshirt2,
        name: "Crew Neck T-Shirt",
        category: "tops",
        color: "#000000"
      },
      {
        id: "tshirt-3",
        thumbnail: tshirt3,
        name: "V-Neck T-Shirt",
        category: "tops",
        color: "#0000ff"
      },
      {
        id: "tshirt-4",
        thumbnail: tshirt4,
        name: "Sport T-Shirt",
        category: "tops",
        color: "#808080"
      },
      // Shirts
      {
        id: "shirt-1",
        thumbnail: shirt1,
        name: "Formal Shirt",
        category: "tops",
        color: "#ffffff"
      },
      {
        id: "shirt-2",
        thumbnail: shirt2,
        name: "Casual Shirt", 
        category: "tops",
        color: "#d3d3d3"
      },
      {
        id: "shirt-3",
        thumbnail: shirt3,
        name: "Patterned Shirt",
        category: "tops",
        color: "#87CEEB"
      },
      {
        id: "shirt-4", 
        thumbnail: shirt4,
        name: "Office Shirt",
        category: "tops",
        color: "#F0F8FF"
      },
      // Kurtas
      {
        id: "kurta-1",
        thumbnail: kurta1,
        name: "Traditional Kurta",
        category: "tops",
        color: "#FFA500"
      },
      {
        id: "kurta-2",
        thumbnail: kurta2,
        name: "Festive Kurta",
        category: "tops",
        color: "#800080"
      },
      {
        id: "kurta-3",
        thumbnail: kurta3,
        name: "Casual Kurta",
        category: "tops",
        color: "#008000"
      },
      {
        id: "kurta-4",
        thumbnail: kurta4,
        name: "Designer Kurta",
        category: "tops",
        color: "#B22222"
      },
      // Jeans
      {
        id: "jeans-1",
        thumbnail: jeans1,
        name: "Dark Wash Jeans",
        category: "bottoms",
        color: "#191970"
      },
      {
        id: "jeans-2",
        thumbnail: jeans2,
        name: "Black Jeans",
        category: "bottoms",
        color: "#000000"
      },
      {
        id: "jeans-3",
        thumbnail: jeans3,
        name: "Light Wash Jeans",
        category: "bottoms",
        color: "#87CEFA"
      },
      {
        id: "jeans-4",
        thumbnail: jeans4,
        name: "Ripped Jeans",
        category: "bottoms",
        color: "#4682B4"
      }
    ];
    
    setTryOnImages(clothingItems);
  }, []);

  const addToSelection = (item: TryOnOption) => {
    // Check if we already have an item of this category
    const existingItemIndex = selectedItems.findIndex(
      selected => selected.category === item.category
    );
    
    if (existingItemIndex !== -1) {
      // Replace the item of the same category
      const newSelectedItems = [...selectedItems];
      newSelectedItems[existingItemIndex] = item;
      setSelectedItems(newSelectedItems);
    } else {
      // Add new item
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  const removeFromSelection = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const toggleFavorite = (imageId: string) => {
    setFavorites(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const filteredItems = categoryFilter === "all" 
    ? tryOnImages 
    : tryOnImages.filter(item => item.category === categoryFilter);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Virtual Wardrobe</h1>

        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Display Area */}
            <div className="w-full md:w-2/3 flex flex-col">
              <div className="w-full h-96 md:h-[500px] bg-white rounded-xl shadow-md relative overflow-hidden p-4">
                <h2 className="text-xl font-semibold text-purple-600 mb-6 text-center">Your Selection</h2>
                
                {selectedItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-32 h-32 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-2">No items selected</p>
                    <p className="text-gray-400 text-sm text-center max-w-sm">
                      Click on clothing items from the shelf to add them to your selection
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto content-start">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="relative bg-gray-50 rounded-lg shadow-sm p-2">
                        <div className="flex items-center">
                          <img 
                            src={item.thumbnail} 
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md" 
                          />
                          <div className="ml-3 flex-grow">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                          </div>
                          <button 
                            onClick={() => removeFromSelection(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                          >
                            <span className="text-gray-500">×</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action buttons for the selected items */}
              {selectedItems.length > 0 && (
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    Save Outfit
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            {/* Side Shelf for Clothing Options */}
            <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Clothing Shelf</h2>
              
              {/* Category Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto py-1 flex-nowrap">
                <button 
                  onClick={() => setCategoryFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    categoryFilter === "all" 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Items
                </button>
                <button 
                  onClick={() => setCategoryFilter("tops")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    categoryFilter === "tops" 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tops
                </button>
                <button 
                  onClick={() => setCategoryFilter("bottoms")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    categoryFilter === "bottoms" 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Bottoms
                </button>
                {favorites.length > 0 && (
                  <button 
                    onClick={() => setCategoryFilter("favorites")}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center ${
                      categoryFilter === "favorites" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="mr-1">♥</span>
                    Favorites
                  </button>
                )}
              </div>

              {/* Clothing items grid */}
              {filteredItems.length === 0 && categoryFilter !== "favorites" ? (
                <p className="text-gray-500 text-center py-8">No items found</p>
              ) : categoryFilter === "favorites" && favorites.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No favorites yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {(categoryFilter === "favorites" 
                    ? tryOnImages.filter(item => favorites.includes(item.id))
                    : filteredItems
                  ).map((item) => (
                    <div 
                      key={item.id} 
                      className="relative group cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => addToSelection(item)}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-all"
                      />
                      <div className="absolute inset-0 bg-purple-600 bg-opacity-0 hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white font-bold transition-opacity">Add</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {favorites.includes(item.id) ? (
                          <span className="text-red-500">♥</span>
                        ) : (
                          <span className="text-gray-400">♡</span>
                        )}
                      </button>
                      <div className="pt-1">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quick View of Selected Items */}
              {selectedItems.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Current Selection</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItems.map(item => (
                      <div 
                        key={`selected-${item.id}`}
                        className="relative w-12 h-12 rounded border cursor-pointer hover:border-purple-500"
                      >
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                          {item.category === "tops" ? "T" : "B"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}