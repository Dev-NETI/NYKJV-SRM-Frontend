import * as React from "react";
import {
  Box,
  Drawer,
  Button,
  Grid,
  Typography,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import local_axios from "@/lib/axios";
import PersonIcon from "@mui/icons-material/Person";
import TerrainIcon from "@mui/icons-material/Terrain";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ForestIcon from "@mui/icons-material/Forest";
import LocationCityIcon from "@mui/icons-material/LocationCity";

import Alert from "@mui/material/Alert";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Skeleton from "@mui/material/Skeleton";
import { TimerOutlined } from "@mui/icons-material";
const FormSchema = z
  .object({
    name: z.string().nonempty({ message: "Required" }),
    island: z.string().nonempty({ message: "Required" }),
    region_id: z
      .string()
      .nonempty("Required")
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), { message: "Required" })
      .transform((val) => (val ? Number(val) : null)),
    province_id: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), { message: "Required" })
      .transform((val) => (val ? Number(val) : null)),
    district_id: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Number(val)), { message: "Required" })
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
      .nonempty({ message: "Required" })
      .transform((val) => (val ? Number(val) : null)),
    street_address: z.string().nonempty({ message: "Required" }),
  })
  .strict();

export default function SupplierEdit({ supplierId, onClose, isOpen }) {
  const [islandsGroups, setIslandGroups] = React.useState([]);
  const [regionsGroups, setRegionGroups] = React.useState([]);
  const [provinceGroups, setProvinceGroups] = React.useState([]);
  const [districtGroups, setDistrictGroups] = React.useState([]);
  const [cityGroups, setCityGroups] = React.useState([]);
  const [municipalityGroups, setMunicipalityGroups] = React.useState([]);
  const [barangayGroups, setBarangayGroups] = React.useState([]);
  const [selectedIsland, setSelectedIsland] = React.useState("");
  const [loading, setLoading] = React.useState(true); // Loading state
  const [editAlert, setEditAlert] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });
  React.useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true); // Start loading
      try {
        const islandsResponse = await axios.get(
          "https://psgc.gitlab.io/api/island-groups/"
        );
        setIslandGroups(islandsResponse.data); // This should be an array of { code, name }

        if (islandsResponse.data.length > 0) {
          // Fetch regions for the first island initially
          const firstIslandId = islandsResponse.data[0].code;
          await fetchRegions(firstIslandId); // Fetch regions for the first island
          setSelectedIsland(firstIslandId); // Set first island as selected
        }
      } catch (error) {
        // console.error("Error fetching islands:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchOptions();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (supplierId) {
        setLoading(true); // Start loading
        clearErrors(); // Clear any previous errors
        try {
          const response = await local_axios.get(`/api/supplier/${supplierId}`);
          const data = response.data;
          // console.log("Supplier Data: ", data);

          // Find the selected island and fetch regions for it
          const matchedIsland = islandsGroups.find(
            (island) => island.code === data.island
          );
          if (matchedIsland) {
            setSelectedIsland(matchedIsland.code);
            await fetchRegions(matchedIsland.code); // Fetch regions for the matched island

            // Fetch provinces, districts, and cities conditionally
            await fetchProvinces(data.region_id);
            await fetchDistrict(data.region_id);

            // Prioritize cities by province, then district if necessary
            if (data.province_id) {
              await fetchCitiesByProvince(data.province_id);
            } else if (data.district_id) {
              await fetchCitiesByDistrict(data.district_id);
            }

            await fetchMunicipality(data.province_id);

            // Fetch barangays based on municipality or city
            if (data.municipality_id) {
              await fetchBarangayByMunicipality(data.municipality_id);
            } else {
              await fetchBarangayByCities(data.city_id);
            }

            // Reset the form with fetched data
            reset({
              name: data?.name ?? "",
              island: data?.island ?? "",
              region_id: data?.region_id
                ? String(data.region_id).padStart(9, "0")
                : "",
              province_id: data?.province_id
                ? String(data.province_id).padStart(9, "0")
                : "",
              district_id: data?.district_id
                ? String(data.district_id).padStart(9, "0")
                : "",
              city_id: data?.city_id
                ? String(data.city_id).padStart(9, "0")
                : "",
              municipality_id: data?.municipality_id
                ? String(data.municipality_id).padStart(9, "0")
                : "",
              brgy_id: data?.brgy_id
                ? String(data.brgy_id).padStart(9, "0")
                : "",
              street_address: data?.street_address ?? "",
            });
          }
        } catch (error) {
          // console.error("Error fetching supplier data:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    if (isOpen) {
      // Ensure fetch only runs when modal is open
      fetchData(); // Fetch supplier data
    }
  }, [supplierId, isOpen, reset, islandsGroups]);

  const handleEditAlert = () => {
    setEditAlert(true);
    setTimeout(() => {
      setEditAlert(false);
    }, 3000);
  };
  // Fetch regions based on island code
  const fetchRegions = async (islandCode) => {
    setLoading(true);
    try {
      const regionsResponse = await axios.get(
        `https://psgc.gitlab.io/api/island-groups/${islandCode}/regions/`
      );
      // console.log(
      //   `Fetched regions for island ${islandCode}:`,
      //   regionsResponse.data
      // );
      setRegionGroups(regionsResponse.data);
    } catch (error) {
      // console.error("Error fetching regions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async (regionId) => {
    setLoading(true);
    try {
      const formattedRegionId = String(regionId).padStart(9, "0");
      const provincesResponse = await axios.get(
        `https://psgc.gitlab.io/api/regions/${formattedRegionId}/provinces/`
      );
      // console.log(
      //   `Fetched provinces for region ${formattedRegionId}:`,
      //   provincesResponse.data
      // );
      setProvinceGroups(provincesResponse.data);
    } catch (error) {
      // console.error("Error fetching provinces:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDistrict = async (regionId) => {
    setLoading(true);
    try {
      const formattedRegionId = String(regionId).padStart(9, "0");
      const districtsResponse = await axios.get(
        `https://psgc.gitlab.io/api/regions/${formattedRegionId}/districts/`
      );
      // console.log(
      //   `Fetched districts for region ${formattedRegionId}:`,
      //   districtsResponse.data
      // );
      setDistrictGroups(districtsResponse.data || []);
    } catch (error) {
      // console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitiesByProvince = async (provinceId) => {
    setLoading(true);
    // console.log("Fetching city groups for:", { provinceId });

    if (!provinceId) {
      // console.warn("Province ID is null or undefined");
      setCityGroups([]); // Reset city groups if no province ID
      return;
    }

    const formattedProvinceId =
      provinceId.length === 9
        ? provinceId
        : String(provinceId).padStart(9, "0");

    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/provinces/${formattedProvinceId}/cities/`
      );
      // console.log("Fetched cities:", response.data);
      setCityGroups(response.data || []); // Set city groups to the fetched data
    } catch (error) {
      // console.error("Error fetching city groups:", error);
      setCityGroups([]); // Reset city groups on error
    }
  };

  const fetchCitiesByDistrict = async (districtId) => {
    setLoading(true);
    // console.log("Fetching city groups for:", { districtId });

    if (!districtId) {
      // console.warn("District ID is null or undefined");
      setCityGroups([]); // Reset city groups if no district ID
      return;
    }

    const formattedDistrictId =
      districtId.length === 9
        ? districtId
        : String(districtId).padStart(9, "0");

    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/districts/${formattedDistrictId}/cities/`
      );
      // console.log("Fetched cities:", response.data);
      setCityGroups(response.data || []); // Set city groups to the fetched data
    } catch (error) {
      // console.error("Error fetching city groups:", error);
      setCityGroups([]); // Reset city groups on error
    }
  };

  const fetchMunicipality = async (provinceId) => {
    setLoading(true);
    // console.log("Fetching municipality groups for: ", { provinceId });

    if (!provinceId) {
      // console.warn("Province ID is null or undefined");
      setMunicipalityGroups([]);
      return;
    }

    const formattedMunicipalityId =
      provinceId.length === 9
        ? provinceId
        : String(provinceId).padStart(9, "0");

    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/provinces/${formattedMunicipalityId}/municipalities/`
      );
      // console.log("Fetched municipality groups:", response.data);
      setMunicipalityGroups(response.data || []);
    } catch (error) {
      // console.error("Error fetching municipality groups:", error);
      setMunicipalityGroups([]);
    }
  };

  // Fetch barangays based on city ID
  const fetchBarangayByCities = async (cityId) => {
    setLoading(true);
    // console.log("Fetching barangay groups for:", { cityId });

    if (!cityId) {
      // console.warn("City ID is null or undefined");
      setBarangayGroups([]); // Reset barangay groups if no city ID
      return;
    }

    const formattedCityId =
      cityId.length === 9 ? cityId : String(cityId).padStart(9, "0");

    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/cities/${formattedCityId}/barangays/`
      );
      // console.log("Fetched barangays:", response.data);
      setBarangayGroups(response.data || []); // Set barangay groups to the fetched data
    } catch (error) {
      // console.error("Error fetching barangay groups:", error);
      setBarangayGroups([]); // Reset barangay groups on error
    }
  };

  const fetchBarangayByMunicipality = async (municipalityId) => {
    setLoading(true);
    // console.log("Fetching barangay groups for:", { municipalityId });

    if (!municipalityId) {
      // console.warn("Municipality ID is null or undefined");
      setBarangayGroups([]); // Reset barangay groups if no municipality ID
      return;
    }

    const formattedBarangayMunicipalityId =
      municipalityId.length === 9
        ? municipalityId
        : String(municipalityId).padStart(9, "0");

    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/municipalities/${formattedBarangayMunicipalityId}/barangays/`
      );
      // console.log("Fetched barangays:", response.data);
      setBarangayGroups(response.data || []); // Set barangay groups to the fetched data
    } catch (error) {
      // console.error("Error fetching barangay groups:", error);
      setBarangayGroups([]); // Reset barangay groups on error
    }
  };

  // Update the handleDistrictChange function
  const handleIslandChange = async (e) => {
    const islandCode = e.target.value;
    setSelectedIsland(islandCode);
    clearErrors("island");
    setLoading(true);

    try {
      await fetchRegions(islandCode);
      reset((formValues) => ({
        ...formValues,
        region_id: "",
        province_id: "",
        district_id: "",
        city_id: "",
        municipality_id: "",
        brgy_id: "",
      }));
    } catch (error) {
      // console.error("Error handling island change:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    clearErrors("region_id");
    setLoading(true);

    try {
      await fetchProvinces(regionId);
      await fetchDistrict(regionId);
      reset((formValues) => ({
        ...formValues,
        province_id: "",
        district_id: "",
        city_id: "",
        municipality_id: "",
        brgy_id: "",
      }));
    } catch (error) {
      // console.error("Error handling region change:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    clearErrors("province_id");
    setLoading(true);

    try {
      await fetchCitiesByProvince(provinceId); // Fetch cities
      await fetchMunicipality(provinceId); // Also fetch municipalities

      reset((formValues) => ({
        ...formValues,
        district_id: "",
        city_id: "",
        municipality_id: "", // Reset this only if necessary
        brgy_id: "",
      }));
    } catch (error) {
      // console.error("Error handling province change:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    clearErrors("district_id");
    setLoading(true);

    try {
      await fetchCitiesByDistrict(districtId);
      reset((formValues) => ({
        ...formValues,
        city_id: "",
        municipality_id: "",
        brgy_id: "",
      }));
    } catch (error) {
      // console.error("Error handling district change:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    clearErrors("city_id");
    setLoading(true);

    try {
      await fetchBarangayByCities(cityId);
      reset((formValues) => ({
        ...formValues,
        brgy_id: "",
      }));
    } catch (error) {
      // console.error("Error handling city change:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMunicipalityChange = async (e) => {
    const municipalityId = e.target.value; // Get selected municipality ID
    clearErrors("municipality_id"); // Clear any validation errors for municipality_id
    setLoading(true); // Set loading state to true

    try {
      // Fetch barangays based on the selected municipality
      await fetchBarangayByMunicipality(municipalityId);

      // Reset barangay ID to blank when municipality changes
      reset((formValues) => ({
        ...formValues,
        brgy_id: "", // Reset barangay ID when municipality changes
      }));
    } catch (error) {
      // console.error("Error handling municipality change:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  const submitForm = async (data) => {
    try {
      // Format the data and remove null fields for optional IDs
      const normalizedData = {
        ...data,
        region_id: data.region_id,
        province_id: data.province_id,
        district_id: data.district_id,
        city_id: data.city_id,
        municipality_id: data.municipality_id,
        brgy_id: data.brgy_id,
      };
      // console.log("Updating supplier with data:", normalizedData);
      const response = await local_axios.put(
        `/api/supplier/${supplierId}`,
        normalizedData
      );
      // console.log("Update successful:", response.data);
      handleEditAlert();
      onClose();
    } catch (error) {
      if (error.response) {
        // console.error("Error response from server:", error.response.data);
        alert(
          `Error updating supplier: ${error.response.data.message || "Please check the data and try again."}`
        );
      } else {
        // console.error("Error updating supplier:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleClear = () => {
    reset();
    setIslandGroups([]);
    setRegionGroups([]);
    setProvinceGroups([]);
    setDistrictGroups([]);
    setCityGroups([]);
    setBarangayGroups([]);
    setMunicipalityGroups([]);
  };

  const DrawerList = (anchor) => (
    <Box
      sx={{ width: anchor === "right" ? "500px" : "auto" }}
      role="presentation"
    >
      <div className="p-4">
        <div>
          <KeyboardDoubleArrowRightIcon
            sx={{ cursor: "pointer", color: "grey" }}
            onClick={onClose}
          />
        </div>
        <div className="p-6">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Supplier
          </Typography>
          <div className="mt-6">
            {loading ? ( // Show loading message if loading
              <div>
                <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <br />
                  <Skeleton animation="wave" />
                  <br />
                  <Skeleton animation={false} />
                  <br />
                </Box>
              </div>
            ) : (
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
                      options: islandsGroups,
                    },
                    {
                      name: "region_id",
                      label: "Region",
                      icon: <MapsHomeWorkIcon fontSize="lg" />,
                      component: "select",
                      options: regionsGroups,
                    },
                    {
                      name: "province_id",
                      label: "Province",
                      icon: <ForestIcon fontSize="lg" />,
                      component: "select",
                      options: provinceGroups,
                    },
                    {
                      name: "district_id",
                      label: "District",
                      icon: <LocationCityIcon fontSize="lg" />,
                      component: "select",
                      options: districtGroups,
                    },
                    {
                      name: "city_id",
                      label: "City",
                      icon: <LocationCityIcon fontSize="lg" />,
                      component: "select",
                      options: cityGroups,
                    },
                    {
                      name: "municipality_id",
                      label: "Municipality",
                      icon: <LocationCityIcon fontSize="lg" />,
                      component: "select",
                      options: municipalityGroups,
                    },
                    {
                      name: "brgy_id",
                      label: "Barangay",
                      icon: <LocationCityIcon fontSize="lg" />,
                      component: "select",
                      options: barangayGroups, // This should contain the fetched barangays
                    },
                    {
                      name: "street_address",
                      label: "Street",
                      icon: <LocationCityIcon fontSize="lg" />,
                      type: "text",
                      component: "input",
                    },
                  ].map(
                    ({ name, label, icon, type, component, options }, idx) => (
                      <Grid item xs={12} key={idx}>
                        <Controller
                          name={name}
                          control={control}
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
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        if (name === "island") {
                                          handleIslandChange(e); // Pass event
                                        } else if (name === "region_id") {
                                          handleRegionChange(e); // Pass event
                                        } else if (name === "district_id") {
                                          handleDistrictChange(e); // Pass event
                                        } else if (name === "province_id") {
                                          handleProvinceChange(e); // Pass event
                                        } else if (name === "city_id") {
                                          handleCityChange(e); // Pass event
                                        } else if (name === "municipality_id") {
                                          handleMunicipalityChange(e); // Pass event
                                        }
                                        if (value) clearErrors(name);
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
                                      displayEmpty
                                      error={!!fieldState.error}
                                      IconComponent={() => null}
                                    >
                                      <MenuItem value="" disabled>
                                        <span className="text-gray-400">
                                          Empty
                                        </span>
                                      </MenuItem>
                                      {options &&
                                        options.map((option) => (
                                          <MenuItem
                                            key={option.code || option.id}
                                            value={option.code || option.id}
                                          >
                                            {option.name}
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
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        sx={{
                          color: "white",
                          borderRadius: 2,
                          backgroundColor: "#087ce4",
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            )}
          </div>
        </div>
      </div>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        {DrawerList("right")}
      </Drawer>
      {editAlert ? (
        <div className="fixed inset-x-0 bottom-[7rem] flex justify-center z-50">
          <Alert icon={<NotificationsIcon fontSize="inherit" />} severity="info">
            Successfully Changed
          </Alert>
        </div>
      ) : null}
    </div>
  );
}
