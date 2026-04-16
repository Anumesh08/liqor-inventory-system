"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";

type FormData = {
  confirmDelete: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: Props) => {
  const { handleSubmit } = useForm<FormData>();

  const onSubmit = () => {
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: "rounded-md",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-sm font-medium">Confirm Delete</span>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography className="text-sm">
            Are you sure you want to delete this product?
          </Typography>
        </DialogContent>

        <DialogActions className="p-4">
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            className="text-xs"
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="error"
            className="text-xs"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
