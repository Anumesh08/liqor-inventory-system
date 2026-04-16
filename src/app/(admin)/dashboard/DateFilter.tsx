"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarTodayOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface DateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateFilter({
  selectedDate,
  onDateChange,
}: DateFilterProps) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <CalendarTodayOutlined color="primary" />
            Select Date
          </Typography>

          <DatePicker
            value={dayjs(selectedDate)}
            onChange={(newValue) => {
              if (newValue) {
                onDateChange(newValue.format("YYYY-MM-DD"));
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                size: "small",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                  },
                },
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
}
