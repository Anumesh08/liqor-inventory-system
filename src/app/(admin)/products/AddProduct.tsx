"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  getMainCategories,
  getSubCategories,
  ProductListResponse,
  updateProduct,
} from "@/app/api/Products/Products";
import { useEffect } from "react";

// ✅ ZOD SCHEMA

const schema = z.object({
  main_category_id: z.number().min(1, "Category required"),
  category_id: z.number().optional(),
  product_name: z.string().min(1, "Product name required"),
  mrp: z.number().min(1, "MRP required"),
  barcode: z.string().optional(),
  alias1: z.string().nullable().optional(),
  alias2: z.string().nullable().optional(),
  alias3: z.string().nullable().optional(),
});

type ProductFormType = z.infer<typeof schema>;

type Props = {
  open: boolean;
  handleClose: () => void;
  editData?: ProductListResponse | null;
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
}));

const AddProductDialog = ({ open, handleClose, editData }: Props) => {
  const queryClient = useQueryClient();
  const isEditMode = !!editData;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      main_category_id: editData?.main_category_id || undefined,
      category_id: editData?.category_id || undefined,
      product_name: editData?.product_name || "",
      mrp: editData?.mrp || undefined,
      barcode: editData?.barcode || undefined,
      alias1: editData?.alias1 || null,
      alias2: editData?.alias2 || null,
      alias3: editData?.alias3 || null,
    },
  });

  const selectedCategory = watch("main_category_id");

  // Fetch main categories
  const { data: mainCategoriesData, isLoading: mainCategoriesLoading } =
    useQuery({
      queryKey: ["mainCategories"],
      queryFn: getMainCategories,
      enabled: open,
    });

  const { data: subCategoriesData, isLoading: subCategoriesLoading } = useQuery(
    {
      queryKey: ["subCategories", selectedCategory],
      queryFn: () => getSubCategories(selectedCategory!),
      enabled: !!selectedCategory,
    },
  );

  const mainCategories = mainCategoriesData?.categories || [];
  const subCategories = subCategoriesData?.sub_categories || [];

  // Reset form when editData changes
  useEffect(() => {
    if (editData) {
      reset({
        main_category_id: editData.main_category_id,
        category_id: editData.category_id,
        product_name: editData.product_name,
        mrp: editData.mrp,
        barcode: editData.barcode || undefined,
        alias1: editData.alias1 || null,
        alias2: editData.alias2 || null,
        alias3: editData.alias3 || null,
      });
    } else {
      reset({
        main_category_id: undefined,
        category_id: undefined,
        product_name: "",
        mrp: undefined,
        barcode: undefined,
        alias1: null,
        alias2: null,
        alias3: null,
      });
    }
  }, [editData, reset]);

  const { mutate: createProductMutation, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error creating product:", error);
    },
  });

  const { mutate: updateProductMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
    },
  });

  const onSubmit = (data: ProductFormType) => {
    const formattedData = {
      ...data,
      product_id: Number(editData?.product_id),
      barcode: data.barcode || undefined,
      alias1: data.alias1 || null,
      alias2: data.alias2 || null,
      alias3: data.alias3 || null,
    };

    if (isEditMode) {
      updateProductMutation(formattedData);
    } else {
      createProductMutation(formattedData);
    }
  };

  const handleCancel = () => {
    reset();
    handleClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="md"
      PaperProps={{ elevation: 24, className: "rounded-md shadow-xl" }}
    >
      {/* HEADER */}
      <DialogTitle className="flex justify-between items-center border-b pb-2">
        <span className="text-base font-medium">
          {isEditMode ? "Edit Product" : "Add Product"}
        </span>
        <IconButton onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-4">
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid size={{ xs: 6 }}>
              <FormControl
                fullWidth
                variant="standard"
                error={!!errors.main_category_id}
              >
                <InputLabel className="text-xs">Category *</InputLabel>
                <Select
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    setValue("main_category_id", e.target.value as number);
                    setValue("category_id", undefined); // Reset sub category when main category changes
                  }}
                  label="Category *"
                  className="text-xs"
                  disabled={mainCategoriesLoading}
                >
                  {mainCategories.length > 0 ? (
                    mainCategories.map((cat: any) => (
                      <MenuItem
                        key={cat.main_category_id}
                        value={cat.main_category_id}
                      >
                        {cat.main_category}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No categories available
                    </MenuItem>
                  )}
                </Select>
                {errors.main_category_id && (
                  <FormHelperText>
                    {errors.main_category_id.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <FormControl
                fullWidth
                variant="standard"
                error={!!errors.category_id}
              >
                <InputLabel className="text-xs">Sub Category *</InputLabel>
                <Select
                  value={selectedCategory ? watch("category_id") || "" : ""}
                  onChange={(e) =>
                    setValue("category_id", e.target.value as number)
                  }
                  label="Sub Category *"
                  className="text-xs"
                  disabled={!selectedCategory || subCategoriesLoading}
                >
                  {!selectedCategory ? (
                    <MenuItem disabled value="">
                      Select category first
                    </MenuItem>
                  ) : subCategories.length > 0 ? (
                    subCategories.map((sub: any) => (
                      <MenuItem key={sub.category_id} value={sub.category_id}>
                        {sub.category_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No sub categories available
                    </MenuItem>
                  )}
                </Select>
                {errors.category_id && (
                  <FormHelperText>{errors.category_id.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Product Name *"
                {...register("product_name")}
                error={!!errors.product_name}
                helperText={errors.product_name?.message}
                InputLabelProps={{ className: "text-xs" }}
                inputProps={{ className: "text-xs" }}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                label="MRP *"
                {...register("mrp", { valueAsNumber: true })}
                error={!!errors.mrp}
                helperText={errors.mrp?.message}
                InputLabelProps={{ className: "text-xs" }}
                inputProps={{ className: "text-xs" }}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Barcode"
                {...register("barcode")}
                InputLabelProps={{ className: "text-xs" }}
                inputProps={{ className: "text-xs" }}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Alias 1"
                {...register("alias1")}
                InputLabelProps={{ className: "text-xs" }}
                inputProps={{ className: "text-xs" }}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Alias 2"
                {...register("alias2")}
                InputLabelProps={{ className: "text-xs" }}
                inputProps={{ className: "text-xs" }}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Alias 3"
                {...register("alias3")}
                InputLabelProps={{ className: "text-xs" }}
                inputProps={{ className: "text-xs" }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* ACTIONS */}
        <DialogActions className="border-t p-4 flex justify-end">
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="inherit"
            className="text-xs"
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            className="text-xs"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default AddProductDialog;
