import * as React from "react";
import {
  Box,
  Drawer,
  Button,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import TerrainIcon from "@mui/icons-material/Terrain";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ForestIcon from "@mui/icons-material/Forest";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const FormSchema = z
  .object({
    company: z.string().min(1, "Required"),
    contact_person: z.string().min(1, "Required"),
    contact_number: z.string().min(1, "Required"),
    email_address: z.string().min(1, "Required"),
    address: z.string().min(1, "Required"),
    products: z.string().min(1, "Required"),
    is_active: z.boolean(),
  })
  .strict();

const StoreSupplierUserDrawer = () => {
  const [state, setState] = React.useState({ right: false });
  const { control, clearErrors, handleSubmit, reset } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: "",
      contact_person: "",
      contact_number: "",
      email_address: "",
      address: "",
      products: "",
      is_active: false,
    },
  });

  const [company, setCompany] = React.useState("");
  const [contact_person, setContactPerson] = React.useState("");
  const [contact_number, setContactNumber] = React.useState("");
  const [email_address, setEmailAddress] = React.useState("");
  const [products, setProducts] = React.useState("");
  const [isActive, setIsActive] = React.useState("");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const formList = (anchor) => (
    <Box
      sx={{ width: anchor === "right" ? "500px" : "auto" }}
      role="presentation"
    >
      <div className="p-4">
        <div>
          <KeyboardDoubleArrowRightIcon
            sx={{ cursor: "pointer", color: "grey" }}
            onClick={toggleDrawer(anchor, false)}
          />
        </div>
        <div className="p-6">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Supplier
          </Typography>
          <div className="mt-6">
            <form onSubmit={handleSubmit(submitForm)}>
              <Grid container spacing={1}>
                {[
                  {
                    name: "company",
                    label: "Company",
                    icon: <LocationCityIcon fontSize="lg" />,
                    type: "text",
                    component: "input",
                  },
                  {
                    name: "contact_person",
                    label: "Contact Person",
                    icon: <PersonIcon fontSize="lg" />,
                    type: "text",
                    component: "input",
                  },
                  {
                    name: "contact_number",
                    label: "Contact Number",
                    icon: <ContactPhoneIcon fontSize="lg" />,
                    component: "input",
                    type: "text",
                  },
                  {
                    name: "email_address",
                    label: "Email Address",
                    icon: <MarkunreadIcon fontSize="lg" />,
                    component: "input",
                    type: "email",
                  },
                  {
                    name: "address",
                    label: "Address",
                    icon: <MarkunreadIcon fontSize="lg" />,
                    component: "input",
                    type: "text",
                  },
                  {
                    name: "products",
                    label: "Products",
                    icon: <ShoppingCartIcon fontSize="lg" />,
                    component: "input",
                    type: "text",
                  },
                ].map(
                  (
                    { name, label, icon, type, component, options, onChange },
                    idx
                  ) => (
                    <Grid item xs={12} key={idx}>
                      <Controller
                        name={name}
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                          <div className="flex justify-between gap-4">
                            <div className="w-2/5 flex items-center gap-3 text-[#808080] cursor-pointer hover:bg-[#f8f4f4] rounded-md px-2">
                              {icon}
                              <span className="text-sm">{label}</span>
                            </div>
                            <div className="relative w-3/5">
                              {component === "input" ? (
                                <input
                                  type={type}
                                  className="w-full h-8 cursor-pointer hover:bg-[#f8f4f4] px-3"
                                  placeholder="Empty"
                                  {...field}
                                />
                              ) : (
                                <FormControl fullWidth>
                                  <Select
                                    {...field}
                                    value={field.value || ""}
                                    sx={{
                                      paddingX: "0px",
                                      fontSize: "14px",
                                      height: "32px",
                                      border: "none",
                                      "& fieldset": { border: "none" },
                                      "&:hover": { backgroundColor: "#f8f4f4" },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        { border: "2px solid #000" },
                                    }}
                                    displayEmpty
                                    error={!!fieldState.error}
                                    IconComponent={() => null}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      onChange && onChange(value);
                                      field.onChange(value);
                                      if (value) clearErrors(name);
                                    }}
                                  >
                                    <MenuItem value="" disabled>
                                      <span className="text-gray-400">
                                        Empty
                                      </span>
                                    </MenuItem>
                                    {options &&
                                      options.map((group) => (
                                        <MenuItem
                                          key={group.code}
                                          value={group.code}
                                        >
                                          {group.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              )}
                              {fieldState.error && (
                                <Typography
                                  color="error"
                                  variant="caption"
                                  sx={{
                                    position: "absolute",
                                    right: "0",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "red",
                                  }}
                                >
                                  {fieldState.error.message}
                                </Typography>
                              )}
                            </div>
                          </div>
                        )}
                      />
                    </Grid>
                  )
                )}
                <Grid item xs={12}>
                  <div className="mt-5 flex gap-3">
                    <Button
                      sx={{
                        color: "black",
                        borderRadius: 2,
                        borderColor: "#808080",
                        border: "1px solid #808080",
                      }}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      sx={{
                        color: "white",
                        borderRadius: 2,
                        borderColor: "#808080",
                        backgroundColor: "#087ce4",
                      }}
                    >
                      Register
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </div>
    </Box>
  );

  const submitForm = async (data) => {
    try {
      const response = await axios.post("/api/supplier-user", data);
      console.log("Supplier Created Successfully", response.data);
      reset();
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error submitting the form:", error.message);
      }
    }
  };

  const handleClear = () => {
    reset();
    setCompany("");
    setContactPerson("");
    setContactNumber(0);
    setEmailAddress("");
    setProducts("");
  };

  return (
    <>
      <div>
        <Button
          onClick={toggleDrawer("right", true)}
          sx={{ color: "white", background: "green" }}
        >
          <AddIcon /> SUPPLIER
        </Button>
        <Drawer
          anchor="right"
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {formList("right")}
        </Drawer>
      </div>
    </>
  );
};

export default StoreSupplierUserDrawer;
