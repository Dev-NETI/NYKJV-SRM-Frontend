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

import axios from "axios";
import local_axios from "@/lib/axios";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import TerrainIcon from "@mui/icons-material/Terrain";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ForestIcon from "@mui/icons-material/Forest";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from '@mui/icons-material/Add';

const FormSchema = z
  .object({
    name: z.string().nonempty({ message: "Required" }),
    island: z.string().nonempty("Required"),
    region_id: z
      .string()
      .nonempty("Required")
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "Must be a number",
      })
      .transform((val) => (val ? Number(val) : null)),

    province_id: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "Must be a number",
      })
      .transform((val) => (val ? Number(val) : null)),

    district_id: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "Must be a number",
      })
      .transform((val) => (val ? Number(val) : null)),

    city_id: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "Must be a number",
      })
      .transform((val) => (val ? Number(val) : null)),

    municipality_id: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "Must be a number",
      })
      .transform((val) => (val ? Number(val) : null)),

    brgy_id: z
      .string()
      .nonempty("Required")
      .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
      .transform((val) => Number(val))
      .nullable(),

    street_address: z.string().nonempty({ message: "Required" }),
    is_active: z.boolean().optional(),
  })
  .strict();

const StoreSupplierDrawer = () => {
  const [state, setState] = React.useState({ right: false });
  const { control, clearErrors, handleSubmit, reset } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      island: "",
      province_id: null,
      district_id: null,
      city_id: null,
      municipality_id: null,
      brgy_id: null,
      street_address: "",
      is_active: false,
    },
  });

  const [islandGroups, setIslandGroups] = React.useState([]);
  const [regionGroups, setRegionGroups] = React.useState([]);
  const [provinceGroups, setProvinceGroups] = React.useState([]);
  const [districtGroups, setDistrictGroups] = React.useState([]);
  const [cityGroups, setCityGroups] = React.useState([]);
  const [municipalityGroups, setMunicipalityGroups] = React.useState([]);
  const [barangayGroups, setBarangayGroups] = React.useState([]);
  const [streetAddressGroups, setStreetAddressGroups] = React.useState([]);

  const [selectedIsland, setSelectedIsland] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState(null);
  const [selectedProvince, setSelectedProvince] = React.useState(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState(null);
  const [selectedCity, setSelectedCity] = React.useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = React.useState(null);
  const [selectedBrgy, setSelectedBrgy] = React.useState(null);
  const [selectedStreetAddress, setSelectedStreetAddress] =
    React.useState(null);

  const fetchIslandGroups = async () => {
    try {
      const response = await axios.get(
        "https://psgc.gitlab.io/api/island-groups/"
      );
      setIslandGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching island groups:", error);
      setIslandGroups([]);
    }
  };

  const fetchRegionGroups = async (islandId) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/island-groups/${islandId}/regions/`
      );
      setRegionGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching region groups:", error);
    }
  };

  const fetchProvincesGroups = async (regionId) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/regions/${regionId}/provinces/`
      );
      setProvinceGroups(response.data || []);
      console.log("Fetch Provinces: ", response.data);
    } catch (error) {
      console.error("Error Fetching Provinces:", error);
      setProvinceGroups([]);
    }
  };

  const fetchDistrictGroups = async (regionId) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/regions/${regionId}/districts/`
      );
      setDistrictGroups(response.data || []);
      console.log("Fetch Districts: ", response.data);
    } catch (error) {
      console.error("Error Fetching Districts:", error);
      setDistrictGroups([]);
    }
  };

  const fetchCityGroups = async (districtId) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/districts/${districtId}/cities/`
      );
      setCityGroups(response.data || []);
      console.log("Fetch Cities: ", response.data);
    } catch (error) {
      console.error("Error fetching city groups:", error);
      setCityGroups([]);
    }
  };

  const handleClear = () => {
    reset();
    setRegionGroups([]);
    setProvinceGroups([]);
    setDistrictGroups([]);
    setCityGroups([]);
    setMunicipalityGroups([]);
  };

  const fetchMunicipalities = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/provinces/${provinceId}/municipalities/`
      );
      setMunicipalityGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
      setMunicipalityGroups([]);
    }
  };

  const fetchBarangays = async (municipalityId, cityId) => {
    try {
      const endpoint = municipalityId
        ? `https://psgc.gitlab.io/api/municipalities/${municipalityId}/barangays/`
        : `https://psgc.gitlab.io/api/cities/${cityId}/barangays/`;

      const response = await axios.get(endpoint);
      setBarangayGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching barangays:", error);
      setBarangayGroups([]);
    }
  };

  React.useEffect(() => {
    fetchIslandGroups();
  }, []);

  const handleIslandChange = (islandId) => {
    setSelectedIsland(islandId);
    setSelectedRegion(null);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedCity(null);
    setBarangayGroups([]);
    setStreetAddressGroups([]);
    fetchRegionGroups(islandId);
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedCity(null);
    setBarangayGroups([]);
    setStreetAddressGroups([]);
    fetchProvincesGroups(regionId);
    fetchDistrictGroups(regionId);
  };

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedCity(null);
    setBarangayGroups([]);
    setStreetAddressGroups([]);
    fetchMunicipalities(provinceId);
    fetchCitiesForProvince(provinceId);
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedMunicipality(null);
    setSelectedCity(null);
    setBarangayGroups([]);
    setStreetAddressGroups([]);
    fetchCityGroups(districtId);
  };

  const handleMunicipalityChange = (municipalityId) => {
    setSelectedMunicipality(municipalityId);
    fetchBarangays(municipalityId, null);
    setStreetAddressGroups([]);
  };
  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    setStreetAddressGroups([]);
    fetchBarangays(null, cityId);
  };

  const fetchCitiesForProvince = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/provinces/${provinceId}/cities/`
      );
      setCityGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching cities for province:", error);
      setCityGroups([]);
    }
  };

  
  const submitForm = async (data) => {
    try {
      const response = await local_axios.post("/api/supplier", data);
      console.log("Supplier Created Successfully", response.data);
      reset(); // This clears your form; ensure this function is defined in your code
    } catch (error) {
      if (error.response) {
        // Backend errors (like validation errors)
        console.error("Error response:", error.response.data);
      } else {
        // Other errors (like network issues)
        console.error("Error submitting the form:", error.message);
      }
    }
  };

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
                    name: "name",
                    label: "Name",
                    icon: <PersonIcon fontSize="lg" />,
                    type: "text",
                    component: "input",
                  },
                  {
                    name: "island",
                    label: "Island",
                    icon: <TerrainIcon fontSize="lg" />,
                    component: "select",
                    options: islandGroups,
                    onChange: handleIslandChange,
                  },
                  {
                    name: "region_id",
                    label: "Region",
                    icon: <MapsHomeWorkIcon fontSize="lg" />,
                    component: "select",
                    options: regionGroups,
                    onChange: handleRegionChange,
                  },
                  {
                    name: "province_id",
                    label: "Province",
                    icon: <ForestIcon fontSize="lg" />,
                    component: "select",
                    options: provinceGroups,
                    onChange: handleProvinceChange,
                  },
                  {
                    name: "district_id",
                    label: "District",
                    icon: <LocationCityIcon fontSize="lg" />,
                    component: "select",
                    options: districtGroups,
                    onChange: handleDistrictChange,
                  },
                  {
                    name: "city_id",
                    label: "City",
                    icon: <LocationCityIcon fontSize="lg" />,
                    component: "select",
                    options: cityGroups,
                    onChange: handleCityChange,
                  },
                  {
                    name: "municipality_id",
                    label: "Municipality",
                    icon: <LocationCityIcon fontSize="lg" />,
                    component: "select",
                    options: municipalityGroups,
                    onChange: handleMunicipalityChange,
                  },
                  {
                    name: "brgy_id",
                    label: "Barangay",
                    icon: <GroupsIcon fontSize="lg" />,
                    component: "select",
                    options: barangayGroups,
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

  return (
    <div>
      <Button
        onClick={toggleDrawer("right", true)}
        sx={{ color: "white", background: "green" }}
      >
        <AddIcon/> SUPPLIER
      </Button>
      <Drawer
        anchor="right"
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {formList("right")}
      </Drawer>
    </div>
  );
};

export default StoreSupplierDrawer;
