"use client";

import { Box, Skeleton } from "@mui/material";

export default function InventoryTableSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Skeleton variant="rounded" width={300} height={40} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
        </Box>
      </Box>

      {/* Table Header Skeleton */}
      <Box
        sx={{
          display: "flex",
          bgcolor: "grey.50",
          p: 2,
          borderRadius: 1,
          mb: 1,
        }}
      >
        <Skeleton variant="text" width={200} height={30} sx={{ mr: 2 }} />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="text"
            width={100}
            height={30}
            sx={{ mx: 2 }}
          />
        ))}
      </Box>

      {/* Rows Skeleton */}
      {[1, 2, 3, 4, 5].map((row) => (
        <Box
          key={row}
          sx={{
            display: "flex",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={250} height={25} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>

          {[1, 2, 3, 4].map((col) => (
            <Box key={col} sx={{ mx: 2 }}>
              <Skeleton variant="rounded" width={100} height={32} />
            </Box>
          ))}
        </Box>
      ))}

      {/* Pagination Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Skeleton variant="text" width={200} height={30} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={36} />
          <Skeleton variant="rounded" width={40} height={36} />
          <Skeleton variant="rounded" width={40} height={36} />
          <Skeleton variant="rounded" width={40} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Box>
      </Box>
    </Box>
  );
}
