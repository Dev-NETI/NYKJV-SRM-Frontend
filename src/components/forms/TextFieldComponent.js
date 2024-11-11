import { FormField, FormItem } from "@/components/ui/form";
import { FormControl, TextField } from "@mui/material";
import React from "react";

function TextFieldComponent({ form, name, type, ...props }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormControl fullWidth>
            <TextField
              {...props}
              {...field}
              type={type}
              helperText={error ? error.message : ""}
              error={!!error}
              // Ensure value is never undefined
              value={
                field.value !== undefined
                  ? field.value
                  : type === "number"
                  ? 0
                  : ""
              }
              onChange={(e) => {
                const value =
                  type === "number"
                    ? parseFloat(e.target.value) || ""
                    : e.target.value;
                field.onChange(value);
              }}
              size="small"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default TextFieldComponent;
