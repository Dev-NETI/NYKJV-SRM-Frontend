import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import { useProduct } from "@/hooks/api/product";
import Chip from "@mui/material/Chip";

function OrderListItemComponent({ data, editMode }) {
  const [save, setSave] = useState(null);
  const [price, setPrice] = useState(data?.product?.price);
  const [error, setError] = useState(false);
  const [updateMessage, setUpdateMessage] = useState();
  const { patchNoPayloadW2Param: updateProductPrice } =
    useProduct("update-price");

  const handleSavePrice = async () => {
    if (!price || isNaN(price) || Number(price) < 0) {
      setError("Please enter a valid price.");
    } else {
      setError(false);
      const { data: updateResponse } = await updateProductPrice(
        data?.product?.id,
        price
      );
      setSave(updateResponse);
      setUpdateMessage(updateResponse ? "Success" : "Something went wrong!");
    }
  };

  const handleCloseChip = () => {
    setSave(null);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="center">{data?.product?.name}</TableCell>
      <TableCell align="center">{data?.product?.brand?.name}</TableCell>
      <TableCell align="center">{data?.product?.specification}</TableCell>
      <TableCell align="center">{data?.quantity}</TableCell>
      <TableCell align="center">
        {editMode ? (
          <div className="flex flex-row gap-1">
            <TextField
              label="Enter Price"
              variant="outlined"
              size="small"
              value={price}
              onChange={(event) => {
                setPrice(event.target.value);
                setError(false);
              }}
              error={!!error}
              helperText={error}
            />
            {save === null && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleSavePrice}
              >
                <CheckIcon />
              </Button>
            )}
            {save !== null && (
              <Chip
                label={updateMessage}
                onDelete={handleCloseChip}
                color={updateMessage ? "success" : "error"}
              />
            )}
          </div>
        ) : (
          data?.product?.price
        )}
      </TableCell>
    </TableRow>
  );
}

export default OrderListItemComponent;
