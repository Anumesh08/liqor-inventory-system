"use client";

import {
  Box,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const rows = Array.from({ length: 5 });

const ProductTableSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Skeleton */}

      <Box sx={{ maxHeight: "65vh", overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableCell key={i}>
                  <Skeleton width={80} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination Skeleton */}

      <div className="px-6 py-4 bg-gray-50 flex justify-between">
        <Skeleton width={120} />
        <Skeleton width={160} />
      </div>
    </div>
  );
};

export default ProductTableSkeleton;
