import React from "react";
import { FormField, FormItem } from "@/components/ui/form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function SelectFieldComponent({ form, name, DataState, ...props }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormControl fullWidth error={!!error}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select {...props} {...field} value={field.value || "0"}>
              <MenuItem
                value={0}
                sx={{
                  color: "gray",
                }}
              >
                Please select a {props.label}
              </MenuItem>
              {DataState.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default SelectFieldComponent;