"use client";

import { Product } from "@/types";

interface InventoryTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPage: number;
}

export default function InventoryTable({
  products,
  currentPage,
  totalPages,
  totalProducts,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
}: InventoryTableProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getStockStatusColor = (stock: string) => {
    const stockNum = parseInt(stock) || 0;

    if (stockNum === 0) return "bg-red-100 text-red-800";
    if (stockNum < 10) return "bg-orange-100 text-orange-800";
    if (stockNum < 50) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Inventory Details - Closing Stock
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="mr-2 text-sm text-gray-600">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Total: <span className="font-semibold">{totalProducts}</span>{" "}
              products • Page:{" "}
              <span className="font-semibold">
                {currentPage}/{totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm mt-1">
                      {currentPage > 1
                        ? "No more products on this page"
                        : "Try selecting a different shop"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={`${product.stock_id}-${product.product_id}-${product.psid}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Product Name Column */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {product.product_name}
                    </div>
                  </td>

                  {/* Size Column */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {product.size} ({product.size_title})
                    </div>
                  </td>

                  {/* Closing Stock Column */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(
                        product.stock_qty,
                      )}`}
                    >
                      {parseInt(product.stock_qty).toLocaleString()} units
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Page Info */}
            <div className="text-sm text-gray-700">
              Showing page <span className="font-semibold">{currentPage}</span>{" "}
              of <span className="font-semibold">{totalPages}</span> •{" "}
              <span className="font-semibold">{products.length}</span> products
              on this page
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className="w-10 h-10 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>

            {/* Page Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Math.max(
                    1,
                    Math.min(totalPages, Number(e.target.value) || 1),
                  );
                  onPageChange(page);
                }}
                className="w-16 px-2 py-1 border rounded text-center text-sm"
              />
              <span className="text-sm text-gray-600">/ {totalPages}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
