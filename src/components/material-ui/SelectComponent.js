import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function SelectComponent({ label, data = null, ...props }) {
  return (
    <FormControl >
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select {...props}>
        {data &&
          data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default SelectComponent;
