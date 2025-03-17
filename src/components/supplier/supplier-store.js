import * as React from "react";
import useSWR from "swr";
import {
  Box,
  Drawer,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ForestIcon from "@mui/icons-material/Forest";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ReportIcon from "@mui/icons-material/Report";

// Define the schema
const FormSchema = z
  .object({
    name: z.string().min(1, "Required"),
    department: z.number().min(1, "Required"),
    region: z.string().min(1, "Required"),
    province: z.string().min(1, "Required"),
    citymun: z.string().min(1, "Required"),
    brgy: z.string().min(1, "Required"),
    street_address: z.string().min(1, "Required"),
    is_active: z.boolean().optional(),
  })
  .strict();

const fetcher = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching data from", url, error);
  }
};

const StoreSupplierDrawer = () => {
  const [alert, setAlert] = React.useState(false);
  const [warningAlert, setWarningAlert] = React.useState(false);
  const [state, setState] = React.useState({ right: false });
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCityMun, setSelectedCityMun] = React.useState("");
  const [selectedBarangay, setSelectedBarangay] = React.useState("");

  const { data: departmentData } = useSWR("/api/supplier/department", fetcher);
  const { data: regionData } = useSWR("/api/supplier/fetch_region", fetcher);
  const { data: provinceData } = useSWR(
    "/api/supplier/fetch_province",
    fetcher
  );
  const { data: citymunData } = useSWR("/api/supplier/fetch_citymun", fetcher);
  const { data: brgyData } = useSWR("/api/supplier/fetch_brgy", fetcher);

  // Compute filtered provinces based on selectedRegion using useMemo.
  const filteredProvinces = React.useMemo(() => {
    if (!selectedRegion || !provinceData?.province) return [];
    return provinceData.province.filter(
      (prov) => String(prov.regCode) === String(selectedRegion)
    );
  }, [selectedRegion, provinceData]);

  const filteredCitymun = React.useMemo(() => {
    if (!selectedProvince || !citymunData?.citymun) return [];
    return citymunData.citymun.filter(
      (city) => String(city.provCode) === String(selectedProvince)
    );
  }, [selectedProvince, citymunData]);

  const filteredBrgy = React.useMemo(() => {
    if (!selectedCityMun || !brgyData?.brgy) return [];
    return brgyData.brgy.filter(
      (brgy) => String(brgy.citymunCode) === String(selectedCityMun)
    );
  }, [selectedCityMun, brgyData]);

  const { control, clearErrors, handleSubmit, reset } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      department: "",
      region: "",
      province: "",
      street_address: "",
      citymun: "",
      brgy: "",
      is_active: false,
    },
  });

  const handleRegionChange = (value) => {
    console.log("Region changed to:", value);
    setSelectedRegion(value);
    setSelectedProvince("");
    setSelectedCityMun("");
    setSelectedBarangay("");
  };

  const handleProvinceChange = (value) => {
    console.log("Province changed to:", value);
    setSelectedProvince(value);
    setSelectedCityMun("");
    setSelectedBarangay("");
  };

  const handleCityMunChange = (value) => {
    console.log("CityMun changed to:", value);
    setSelectedCityMun(value);
    setSelectedBarangay("");
  };

  const handleBarangayChange = (value) => {
    console.log("Barangay changed to:", value);
    setSelectedBarangay(value);
  };

  const handleClear = () => {
    reset();
    setSelectedRegion("");
    setSelectedProvince("");
    setSelectedCityMun("");
    setSelectedBarangay("");
  };

  const handleAlert = () => {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };

  const handleWarningAlert = () => {
    setWarningAlert(true);
    setTimeout(() => {
      setWarningAlert(false);
    }, 3000);
  };

  const submitForm = async (data) => {
    console.log("Form Data:", data); // Check the data being sent
    try {
      const response = await axios.post("/api/supplier", data);
      handleAlert();
      reset();
      setState({ ...state, right: false });
    } catch (error) {
      if (error.response.status == 409) {
        // console.error("Submission error:", error.response.data);
        // console.error("Supplier Already Exist")
        handleWarningAlert(true);
        setState({ ...state, right: false });
      } else {
        console.error("Submission error:", error.message);
      }
    }
  };
  

  const toggleDrawer = (anchor, open) => (event) => {
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
                    name: "name",
                    label: "Name",
                    icon: <PersonIcon fontSize="lg" />,
                    type: "text",
                    component: "input",
                  },
                  {
                    name: "department",
                    label: "Department",
                    icon: <WorkspacesIcon fontSize="lg" />,
                    type: "text",
                    component: "select",
                    options: (departmentData?.department || []).map((dept) => ({
                      code: Number(dept.id), // Force it to a number
                      name: dept.name,
                    })),
                  },
                  {
                    name: "region",
                    label: "Region",
                    icon: <MapsHomeWorkIcon fontSize="lg" />,
                    component: "select",
                    onChange: (value) => handleRegionChange(value),
                    options: (regionData?.region || []).map((reg) => ({
                      id: reg.id,
                      code: reg.regCode,
                      name: reg.regDesc,
                    })),
                  },
                  {
                    name: "province",
                    label: "Province",
                    icon: <ForestIcon fontSize="lg" />,
                    component: "select",
                    onChange: (value) => handleProvinceChange(value),
                    options: filteredProvinces.map((prov) => ({
                      id: prov.id,
                      code: prov.provCode,
                      name: prov.provDesc,
                    })),
                  },
                  {
                    name: "citymun",
                    label: "Municipality",
                    icon: <LocationCityIcon fontSize="lg" />,
                    component: "select",
                    onChange: (value) => handleCityMunChange(value),
                    options: filteredCitymun.map((cm) => ({
                      id: cm.id,
                      code: cm.citymunCode,
                      name: cm.citymunDesc,
                    })),
                  },
                  {
                    name: "brgy",
                    label: "Barangay",
                    icon: <GroupsIcon fontSize="lg" />,
                    component: "select",
                    onChange: (value) => handleBarangayChange(value),
                    options: filteredBrgy.map((brgy) => ({
                      id: brgy.id,
                      code: brgy.brgyCode,
                      name: brgy.brgyDesc,
                    })),
                  },
                  {
                    name: "street_address",
                    label: "Street",
                    icon: <PersonIcon fontSize="lg" />,
                    type: "text",
                    component: "input",
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
                            <div className="w-1/3 flex items-center gap-3 text-[#808080] cursor-pointer hover:bg-[#f8f4f4] rounded-md px-2">
                              {icon}
                              <span className="text-sm">{label}</span>
                            </div>
                            <div className="relative w-2/3">
                              {component === "input" ? (
                                <input
                                  type={type}
                                  className="w-full h-8 cursor-pointer hover:bg-[#f8f4f4] px-3 text-sm"
                                  placeholder="Empty"
                                  {...field}
                                />
                              ) : (
                                <FormControl fullWidth>
                                  <Select
                                    {...field}
                                    value={field.value || ""}
                                    displayEmpty
                                    renderValue={(selected) => {
                                      if (selected === "") {
                                        return (
                                          <span className="text-gray-400">
                                            Empty
                                          </span>
                                        );
                                      }
                                      const selectedOption = options.find(
                                        (option) => option.code === selected
                                      );
                                      return selectedOption ? (
                                        selectedOption.name
                                      ) : (
                                        <span className="text-gray-400">
                                          Empty
                                        </span>
                                      );
                                    }}
                                    sx={{
                                      paddingX: "0px",
                                      fontSize: "14px",
                                      height: "32px",
                                      border: "none",
                                      "& fieldset": { border: "none" },
                                      "&:hover": { backgroundColor: "#f8f4f4" },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          border: "2px solid #000",
                                        },
                                    }}
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

  return (
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
      {alert && (
        <div className="fixed inset-x-0 bottom-[7rem] flex justify-center z-50">
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Successfully Added
          </Alert>
        </div>
      )}
      {warningAlert && (
        <div className="fixed inset-x-0 bottom-[7rem] flex justify-center z-50">
          <Alert icon={<ReportIcon fontSize="inherit" />} severity="warning">
            Supplier Already Exist
          </Alert>
        </div>
      )}
    </div>
  );
};

export default StoreSupplierDrawer;
