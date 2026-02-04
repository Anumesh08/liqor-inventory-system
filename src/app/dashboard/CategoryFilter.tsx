"use client";

import { Category } from "@/app/hooks/useCategory";
import { CategoryOutlined } from "@mui/icons-material";
import { Box, MenuItem, TextField, Typography } from "@mui/material";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <>
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            fontSize: "1.25rem",
            gap: 1,
          }}
        >
          <CategoryOutlined color="primary" />
          Select Category
        </Typography>

        <TextField
          select
          fullWidth
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "background.paper",
            },
          }}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.id}
              value={category.id}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" fontWeight={500}>
                  {category.name}
                </Typography>
                {category.code && (
                  <Typography variant="caption" color="text.secondary">
                    Code: {category.code}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </>
  );
}
