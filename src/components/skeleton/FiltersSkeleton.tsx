"use client";

import { Box, Skeleton } from "@mui/material";

export default function FiltersSkeleton() {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        py: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Skeleton
            variant="rounded"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rounded"
            width={140}
            height={40}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rounded"
            width={160}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        <Skeleton
          variant="rounded"
          width={160}
          height={44}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
}
