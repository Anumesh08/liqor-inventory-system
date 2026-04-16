"use client";

import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";

import { Search } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useRef, useState } from "react";

import AddProductDialog from "./AddProduct";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ProductTableSkeleton from "@/components/skeleton/ProductTableSkeleton";
import {
  deleteProduct,
  getProductsAPI,
  ProductListResponse,
  ProductResponse,
} from "@/app/api/Products/Products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: () => {
      // Invalidate and refetch products query
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
    },
  });
};

const ProductTable = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<ProductListResponse | null>(
    null,
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const pageLimit = 20;

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const { data: ProductsData, isLoading } = useQuery<ProductResponse>({
    queryKey: ["products", page, debouncedSearch],
    queryFn: () => getProductsAPI(page, pageLimit, debouncedSearch),
    keepPreviousData: true,
  });

  const products: ProductListResponse[] = ProductsData?.data || [];
  const totalPages = ProductsData?.totalPages || 1;

  const handleOpen = (product?: ProductListResponse) => {
    if (product) {
      setEditProduct(product);
    } else {
      setEditProduct(null);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleDeleteOpen = (product_id: number) => {
    setSelectedProductId(product_id);
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId, {
        onSuccess: () => {
          handleDeleteClose();
        },
        onError: (error) => {
          console.error("Failed to delete product:", error);
        },
      });
    }
  };
  return (
    <>
      <div className="bg-white rounded shadow-lg overflow-hidden">
        {/* Header */}

        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {/* Search */}

            <div className="w-full max-w-md">
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                placeholder="Search product, Aliases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "white",
                  "& input": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            </div>
            <Button variant="contained" onClick={() => handleOpen()}>
              Add Product
            </Button>
          </div>
        </div>

        {/* Table */}

        <Box sx={{ maxHeight: "65vh", overflow: "auto" }}>
          {isLoading ? (
            <ProductTableSkeleton />
          ) : (
            <Table>
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  background: "#F7F9FC",
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableCell>Sr.No</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Sub Category</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>MRP</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Alias1</TableCell>
                  <TableCell>Alias2</TableCell>
                  <TableCell>Alias3</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p: ProductListResponse, index: number) => (
                    <TableRow key={p.product_id}>
                      <TableCell>
                        {(page - 1) * pageLimit + index + 1}
                      </TableCell>

                      <TableCell>{p.main_category || "N/A"}</TableCell>

                      <TableCell>{p.category || "N/A"}</TableCell>

                      <TableCell>{p.product_name || "N/A"}</TableCell>

                      <TableCell>{p.mrp || "N/A"}</TableCell>

                      <TableCell>{p.barcode || "N/A"}</TableCell>

                      <TableCell>{p.alias1 || "N/A"}</TableCell>

                      <TableCell>{p.alias2 || "N/A"}</TableCell>
                      <TableCell>{p.alias3 || "N/A"}</TableCell>

                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpen(p)}>
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOpen(p.product_id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Pagination */}

        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <div>
            Page {page} of {totalPages}
          </div>

          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)} // Use page state directly
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)} // Use page state directly
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddProductDialog
        open={open}
        handleClose={handleClose}
        editData={editProduct}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProductTable;
