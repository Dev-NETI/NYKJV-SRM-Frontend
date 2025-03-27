import useSWR from "swr";
import axios from "@/lib/axios";
import * as React from "react";
import { useForm } from "react-hook-form"; 
import {
  Box,
  Drawer,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ForestIcon from "@mui/icons-material/Forest";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupsIcon from "@mui/icons-material/Groups";
export default function SupplierRead({ supplierId, onClose, isOpen }) {
  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error("Error fetching supplier", error);
      return null; // Return null to handle errors gracefully
    }
  };

  const { data: supplierData, error } = useSWR(
    supplierId ? `/api/supplier/${supplierId}` : null,
    fetcher
  );

  console.log("Supplier data for read ID", supplierData);

  const supplierArray = React.useMemo(() => {
    if (!supplierData) return [
      { name: "name", label: "Name", value: "N/A", icon: <PersonIcon fontSize="lg" /> },
      { name: "department", label: "Department", value: "N/A", icon: <WorkspacesIcon fontSize="lg" /> },
      { name: "region", label: "Region", value: "N/A", icon: <MapsHomeWorkIcon fontSize="lg" /> },
      { name: "province", label: "Province", value: "N/A", icon: <ForestIcon fontSize="lg" /> },
      { name: "citymun", label: "CityMun", value: "N/A", icon: <LocationCityIcon fontSize="lg" /> },
      { name: "brgy", label: "Barangay", value: "N/A", icon: <GroupsIcon fontSize="lg" /> },
      { name: "street_address", label: "St. Address", value: "N/A", icon: <PersonIcon fontSize="lg" /> },
    ];
    
    return [
      { name: "name", label: "Name", value: supplierData.name || "N/A", icon: <PersonIcon fontSize="lg" /> },
      { name: "department", label: "Department", value: supplierData.department?.name || "N/A", icon: <WorkspacesIcon fontSize="lg" /> },
      { name: "region", label: "Region", value: supplierData.region?.regDesc || "N/A", icon: <MapsHomeWorkIcon fontSize="lg" /> },
      { name: "province", label: "Province", value: supplierData.province?.provDesc || "N/A", icon: <ForestIcon fontSize="lg" /> },
      { name: "citymun", label: "CityMun", value: supplierData.citymun?.citymunDesc || "N/A", icon: <LocationCityIcon fontSize="lg" /> },
      { name: "brgy", label: "Barangay", value: supplierData.brgy?.brgyDesc || "N/A", icon: <GroupsIcon fontSize="lg" /> },
      { name: "street_address", label: "St. Address", value: supplierData.street_address || "N/A", icon: <PersonIcon fontSize="lg" /> },
    ];
  }, [supplierData]);

  const DrawerList = React.useMemo(() => (
    <Box sx={{ width: "500px" }} role="presentation">
      <div className="p-4">
        <KeyboardDoubleArrowRightIcon
          sx={{ cursor: "pointer", color: "grey" }}
          onClick={() => onClose()}
        />
        <div className="p-6">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Supplier
          </Typography>
          <div className="mt-6">
            <Grid container spacing={1}>
              {/* Check if data is loading */}
              {supplierData ? (
                supplierArray.map(({ label, icon, value }, idx) => (
                  <Grid item xs={12} key={idx}>
                    <div className="flex justify-between gap-4">
                      <div className="w-1/3 flex items-center gap-3 text-[#808080] cursor-pointer hover:bg-[#f8f4f4] rounded-md px-2">
                        {icon}
                        <span className="text-sm">{label}</span>
                      </div>
                      <div className="w-2/3 px-3 py-2 bg-gray-100 text-sm rounded-md">
                        {value}
                      </div>
                    </div>
                  </Grid>
                ))
              ) : (
                // Render Skeleton loading when data is being fetched
                Array.from(new Array(7)).map((_, idx) => (
                  <Grid item xs={12} key={idx}>
                    <div className="flex justify-between gap-4">
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
            </Grid>
          </div>
        </div>
      </div>
    </Box>
  ), [supplierData, supplierArray]);

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      {DrawerList}
    </Drawer>
  );
}
