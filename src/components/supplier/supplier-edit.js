import * as React from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
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
  Skeleton,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ForestIcon from "@mui/icons-material/Forest";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupsIcon from "@mui/icons-material/Groups";
import { set } from "date-fns";

const FormSchema = z
  .object({
    name: z.string().min(1, "Required"),
    department: z.number().min(1, "Required"),
    region: z.string().min(1, "Required"),
    province: z.string().min(1, "Required"),
    citymun: z.string().min(1, "Required"),
    brgy: z.string().min(1, "Required"),
    street_address: z.string().min(1, "Required"),
  })
  .strict();

export default function SupplierEdit({ supplierId, onClose, isOpen }) {
  const [alert, setAlert] = React.useState(false);
  const [warningAlert, setWarningAlert] = React.useState(false);
  const [state, setState] = React.useState({ right: false });
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCityMun, setSelectedCityMun] = React.useState("");
  const [selectedBarangay, setSelectedBarangay] = React.useState("");
  const [departmentData, setDepartmentData] = React.useState([]);
  const [regionData, setRegionData] = React.useState([]);
  const [provinceData, setProvinceData] = React.useState([]);
  const [citymunData, setCitymunData] = React.useState([]);
  const [brgyData, setBrgyData] = React.useState([]);
  const [controller, setController] = React.useState(null);
  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error("Error fetching supplier", error);
      return null;
    }
  };
  const { control, clearErrors, handleSubmit, reset, getValues, setValue } =
    useForm({
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
      mode: "onChange",
    });
  const { data: supplierData, error } = useSWR(
    supplierId ? `/api/supplier/${supplierId}` : null,
    fetcher
  );
  const fetchData = async () => {
    if (controller) {
      controller.abort();
    }
    const newController = new AbortController();
    setController(newController);
    try {
      const [departments, regions, provinces, cities, barangays] =
        await Promise.all([
          axios.get("/api/supplier/department", {
            signal: newController.signal,
          }),
          axios.get("/api/supplier/fetch_region", {
            signal: newController.signal,
          }),
          axios.get("/api/supplier/fetch_province", {
            signal: newController.signal,
          }),
          axios.get("/api/supplier/fetch_citymun", {
            signal: newController.signal,
          }),
          axios.get("/api/supplier/fetch_brgy", {
            signal: newController.signal,
          }),
        ]);
      setDepartmentData(departments.data || []);
      setRegionData(regions.data || []);
      setProvinceData(provinces.data || []);
      setCitymunData(cities.data || []);
      setBrgyData(barangays.data || []);
    } catch (error) {
      if (error.name === "AbortError") {
      } else {
        console.error("Error fetching supplier data:", error);
      }
    }
  };

  React.useEffect(() => {
    if (supplierId && supplierData) {
      reset({
        name: supplierData.name || "",
        department: supplierData.department?.id || "",
        region: supplierData.region?.regCode || "",
        province: supplierData.province?.provCode || "", 
        citymun: supplierData.citymun?.citymunCode || "",
        brgy: supplierData.brgy?.brgyCode || "",
        street_address: supplierData.street_address || "",
      });
      setSelectedProvince(supplierData.province?.provCode || "None");
    }
  }, [supplierId, supplierData, reset]);

  const filteredProvinces = React.useMemo(() => {
    if (!selectedRegion || !provinceData?.province) return [];
    const filtered = provinceData.province.filter(
      (prov) => String(prov.regCode) === String(selectedRegion)
    );

    return filtered;
  }, [selectedRegion, provinceData]);

  const filteredCitymun = React.useMemo(() => {
    if (!selectedProvince || !citymunData?.citymun) return [];
    const filtered = citymunData.citymun.filter(
      (city) => String(city.provCode) === String(selectedProvince)
    );
    return filtered;
  }, [selectedProvince, citymunData]);

  const filteredBrgy = React.useMemo(() => {
    if (!selectedCityMun || !brgyData?.brgy) return [];
    const filtered = brgyData.brgy.filter(
      (brgy) => String(brgy.citymunCode) === String(selectedCityMun)
    );
    return filtered;
  }, [selectedCityMun, brgyData]);
  const toggleDrawer = (anchor, open) => async (event) => {
    setState({ ...state, [anchor]: open });
    if (open) {
      await fetchData();
    }
  };
  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSelectedProvince("");
    setSelectedCityMun("");
    setSelectedBarangay("");

    setValue("province", "");
    setValue("citymun", "");
    setValue("brgy", "");
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCityMun("");
    setSelectedBarangay("");

    setValue("citymun", "");
    setValue("brgy", "");
  };
  const handleCityMunChange = (value) => {
    setSelectedCityMun(value);
    setSelectedBarangay("");
    setValue("brgy", "");
  };
  const handleBarangayChange = (value) => {
    setSelectedBarangay(value);
  };
  const handleClear = () => {
    reset({
      name: "",
      department: "",
      region: "",
      province: "",
      street_address: "",
      citymun: "",
      brgy: "",
    });
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

  const closeDrawer = () => {
    if (controller) {
      controller.abort();
      setController(null);
    }
    onClose();
  };

  const submitForm = async (data) => {
    try {
      const response = await axios.put(`/api/supplier/${supplierId}`, data);
      onClose();
    } catch (error) {
      console.log("Submission error: ", error.message);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const DrawerList = React.useMemo(() => (
    <Box sx={{ width: "500px" }} role="presentation">
      <div className="p-4">
        <div>
          <KeyboardDoubleArrowRightIcon
            sx={{ cursor: "pointer", color: "grey" }}
            onClick={() => closeDrawer()}
          />
        </div>
        <div className="p-6">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Supplier
          </Typography>
          <div className="mt-6">
            <form onSubmit={handleSubmit(submitForm)}>
              {supplierData ? (
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
                      options: (departmentData?.department || []).map(
                        (dept) => ({
                          code: Number(dept.id),
                          name: dept.name,
                        })
                      ),
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
                      value: selectedProvince,
                      component: "select",
                      onChange: (value) => handleProvinceChange(value),
                      options:
                        filteredProvinces.length > 0
                          ? filteredProvinces.map((prov) => ({
                              id: prov.id,
                              code: prov.provCode,
                              name: prov.provDesc,
                            }))
                          : (provinceData?.province || []).map((prov) => ({
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
                      options:
                        filteredCitymun.length > 0
                          ? filteredCitymun.map((cm) => ({
                              id: cm.id,
                              code: cm.citymunCode,
                              name: cm.citymunDesc,
                            }))
                          : (citymunData?.citymun || []).map((cm) => ({
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
                      options:
                        filteredBrgy.length > 0
                          ? filteredBrgy.map((brgy) => ({
                              id: brgy.id,
                              code: brgy.brgyCode,
                              name: brgy.brgyDesc,
                            }))
                          : (brgyData?.brgy || []).map((brgy) => ({
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
                          rules={{ required: `${label} is required` }} // 🔹 Add validation
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
                                    className={`w-full h-8 cursor-pointer hover:bg-[#f8f4f4] px-3 text-sm ${
                                      fieldState.error
                                        ? "border border-red-500"
                                        : ""
                                    }`}
                                    placeholder="Empty"
                                    {...field}
                                  />
                                ) : (
                                  <FormControl
                                    fullWidth
                                    error={!!fieldState.error}
                                  >
                                    <Select
                                      {...field}
                                      value={field.value || ""}
                                      displayEmpty
                                      renderValue={(selected) => {
                                        if (!selected) {
                                          return (
                                            <span className="text-gray-400">
                                              Empty
                                            </span>
                                          );
                                        }
                                        const selectedOption = options?.find(
                                          (option) => option.code === selected
                                        );
                                        return selectedOption
                                          ? selectedOption.name
                                          : "Empty";
                                      }}
                                      sx={{
                                        paddingX: "0px",
                                        fontSize: "14px",
                                        height: "32px",
                                        border: "none",
                                        "& fieldset": { border: "none" },
                                        "&:hover": {
                                          backgroundColor: "#f8f4f4",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                          {
                                            border: "2px solid #000",
                                          },
                                      }}
                                      IconComponent={() => null}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        onChange?.(value); // 🔹 Safer optional chaining
                                        field.onChange(value);
                                        if (value) clearErrors(name);
                                      }}
                                    >
                                      <MenuItem value="" disabled>
                                        <span className="text-gray-400">
                                          Empty
                                        </span>
                                      </MenuItem>
                                      {Array.isArray(options) ? (
                                        options.map((group) => (
                                          <MenuItem
                                            key={group.code}
                                            value={group.code}
                                          >
                                            {group.name}
                                          </MenuItem>
                                        ))
                                      ) : (
                                        <MenuItem disabled>
                                          No options available
                                        </MenuItem>
                                      )}
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
              ) : (
                // Render Skeleton loading when data is being fetched
                Array.from(new Array(7)).map((_, idx) => (
                  <Grid item xs={12} key={idx}>
                    <div className="mt-2 flex justify-between gap-4">
                      <div className="w-1/3 flex items-center gap-3 text-[#808080] cursor-pointer hover:bg-[#f8f4f4] rounded-md px-2">
                        <Skeleton variant="circle" width={24} height={24} />
                        <Skeleton width="60%" />
                      </div>
                      <div className="w-2/3 px-3 py-2 bg-gray-100 text-sm rounded-md">
                        <Skeleton width="100%" />
                      </div>
                    </div>
                  </Grid>
                ))
              )}
            </form>
          </div>
        </div>
      </div>
    </Box>
  ));

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      {DrawerList}
    </Drawer>
  );
}
