import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useOrder } from "@/stores/OrderContext";

const steps = ["RFQ", "Memo", "P.O.", "Delivery"];

function OrderStepperComponent() {
  const { activeStepper, setActiveStepper } = useOrder();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "10vh",
      }}
    >
      <Stack direction="row" spacing={10}>
        {steps.map((label, index) => (
          <Chip
            key={label}
            label={label}
            color={index === activeStepper ? "primary" : "default"}
            onClick={() => setActiveStepper(index)}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default OrderStepperComponent;
