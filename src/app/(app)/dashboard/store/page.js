"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const FormSchema = z
  .object({
    name: z.string().nonempty({ message: "Name is required." }),
    island_id: z.number().int().nonnegative().max(100),
    province_id: z.number().int().nonnegative().max(100),
    municipality_id: z.number().int().nonnegative().max(100),
    brgy_id: z.number().int().nonnegative().max(100),
    street_address: z.string().nonempty({ message: "Street Address is required." }),
    is_active: z.boolean().optional(),
  })
  .strict();

const Store = () => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      island_id: "",
      province_id: "",
      municipality_id: "",
      brgy_id: "",
      street_address: "",
      is_active: false,
    },
  });

  const [islandGroups, setIslandGroups] = useState([]);
  const [provinceGroups, setProvinceGroups] = useState([]);
  const [municipalityGroups, setMunicipalityGroups] = useState([]);
  const [barangayGroups, setBarangayGroups] = useState([]);

  const [selectedIsland, setSelectedIsland] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const fetchIslandGroups = async () => {
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/island-groups/");
      setIslandGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching island groups:", error);
      setIslandGroups([]);
    }
  };

  const fetchProvincesGroups = async (islandId) => {
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/island-groups/${islandId}/provinces/`);
      setProvinceGroups(response.data || []);
    } catch (error) {
      console.error("Error Fetching Provinces:", error);
      setProvinceGroups([]);
    }
  };

  const fetchMunicipalities = async (provinceId) => {
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/provinces/${provinceId}/municipalities/`);
      setMunicipalityGroups(response.data || []);
    } catch (error) {
      console.error("Error Fetching Municipalities:", error);
      setMunicipalityGroups([]);
    }
  };

  const fetchBarangays = async (municipalityId) => {
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${municipalityId}/barangays/`);
      setBarangayGroups(response.data || []);
    } catch (error) {
      console.error("Error Fetching Barangays:", error);
      setBarangayGroups([]);
    }
  };

  useEffect(() => {
    fetchIslandGroups();
  }, []);

  const handleIslandChange = (islandId) => {
    setSelectedIsland(islandId);
    setSelectedProvince(null);
    setSelectedMunicipality(null);
    setBarangayGroups([]);
    fetchProvincesGroups(islandId);
  };

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedMunicipality(null);
    setBarangayGroups([]);
    fetchMunicipalities(provinceId);
  };

  const handleMunicipalityChange = (municipalityId) => {
    setSelectedMunicipality(municipalityId);
    fetchBarangays(municipalityId);
  };

  const submitForm = async (data) => {
    try {
      const response = await axios.post("/dashboard/store", data);
      console.table("Supplier Created Successfully", response.data);
      reset();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <Typography variant="h4" gutterBottom>
        Register a Supplier
      </Typography>
      <form onSubmit={handleSubmit(submitForm)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Name"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="island_id"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="island-group-label">Island Group</InputLabel>
                  <Select
                    labelId="island-group-label"
                    {...field}
                    label="Island Group"
                    error={!!fieldState.error}
                    onChange={(e) => {
                      handleIslandChange(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  >
                    {islandGroups.map((group) => (
                      <MenuItem key={group.code} value={group.code}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography color="error">{fieldState.error.message}</Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="province_id"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="province-group-label">Province Group</InputLabel>
                  <Select
                    labelId="province-group-label"
                    {...field}
                    label="Province Group"
                    error={!!fieldState.error}
                    onChange={(e) => {
                      handleProvinceChange(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    disabled={!selectedIsland}
                  >
                    {provinceGroups.map((group) => (
                      <MenuItem key={group.code} value={group.code}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography color="error">{fieldState.error.message}</Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="municipality_id"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="municipality-group-label">Municipality Group</InputLabel>
                  <Select
                    labelId="municipality-group-label"
                    {...field}
                    label="Municipality Group"
                    error={!!fieldState.error}
                    onChange={(e) => {
                      handleMunicipalityChange(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    disabled={!selectedProvince}
                  >
                    {municipalityGroups.map((group) => (
                      <MenuItem key={group.code} value={group.code}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography color="error">{fieldState.error.message}</Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="brgy_id"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="brgy_id-group-label">Barangay ID</InputLabel>
                  <Select
                    labelId="brgy_id-group-label"
                    {...field}
                    label="Barangay Group"
                    error={!!fieldState.error}
                    disabled={!selectedMunicipality}
                  >
                    {barangayGroups.map((group) => (
                      <MenuItem key={group.code} value={group.code}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography color="error">{fieldState.error.message}</Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="street_address"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Street Address"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ""}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button className="mt-5" type="submit">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Store
