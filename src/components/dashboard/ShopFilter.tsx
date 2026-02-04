"use client";

import { Shop } from "@/types";
import { StoreMallDirectoryOutlined } from "@mui/icons-material";
import { Box, MenuItem, TextField, Typography } from "@mui/material";

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
    <>
      <div>
        {/* Shop Filter - Main Dropdown */}
        <Box sx={{}}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.25rem",
              mb: 1,
              gap: 1,
            }}
          >
            <StoreMallDirectoryOutlined color="primary" />
            Select Shop
          </Typography>

          <TextField
            select
            fullWidth
            value={selectedShop}
            onChange={(e) => onShopChange(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                backgroundColor: "background.paper",
              },
            }}
          >
            {shops.map((shop) => (
              <MenuItem
                key={shop.id}
                value={shop.id.toString()}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1" fontWeight={500}>
                    {shop.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </div>
    </>
  );
}
