"use client";

import { Shop } from "@/types";

interface ShopFilterProps {
  shops: Shop[];
  selectedShop: string;
  onShopChange: (shopId: string) => void;
}

export default function ShopFilter({
  shops,
  selectedShop,
  onShopChange,
}: ShopFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Shop</h2>

      <div className="flex flex-col md:flex-row items-start justify-between md:items-center gap-4">
        {/* Shop Filter - Main Dropdown */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Shop to View Inventory
          </label>
          <select
            value={selectedShop}
            onChange={(e) => onShopChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
          >
            {/* <option value="">Select a shop</option> */}
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id} className="text-xl">
                {shop.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Select a shop to view its closing stock inventory
          </p>
        </div>

        {/* Shop Info Display */}
        {selectedShop && (
          <div className="md:w-1/3 w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">
              Selected Shop Info
            </h3>
            {shops
              .filter((shop) => shop.id.toString() === selectedShop)
              .map((shop) => (
                <div key={shop.id} className="text-sm">
                  <p className="font-semibold text-gray-900">{shop.name}</p>
                  <p className="text-gray-600">License: {shop.code}</p>
                  <p className="text-gray-600 truncate">
                    Address: {shop.address}
                  </p>
                  {shop.contact_no && (
                    <p className="text-gray-600">Contact: {shop.contact_no}</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
