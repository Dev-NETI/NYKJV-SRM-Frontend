"use client"

import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from '@/lib/axios';
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import { useAuth } from "@/hooks/auth";

export default function ComplianceDocumentListSupplierSelection() {
    const { user } = useAuth({ middleware: "auth" });
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(0); 
    const { supplierDocumentState, setSupplierDocumentState } = useContext(
      SupplierDocumentContext
    );
  
    const getSuppliers = async () => {
        try {
            const company = user?.company_id || 0;
            const department = user?.department_id || 0;
            const {data} = await axios.get(`/api/company/${company}/department/${department}/suppliers`);
            setSuppliers(data.suppliers || [])
        } catch(error) {
            console.error(error)
        } 
    }

    useEffect(() => {
      getSuppliers(); 
    }, [])
   

    const handleChange = (event) => {
      setSelectedSupplier(event.target.value || 0);
      setSupplierDocumentState((prevState) => ({
        ...prevState,
        reload: true,
        supplierId: event.target.value || 0 
      }))
    };
  
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel >Supplier</InputLabel>
          <Select
            value={selectedSupplier}
            label="Supplier"
            onChange={handleChange}
          >
            <MenuItem className="text-gray-500" value="0">None</MenuItem>
           {
            suppliers.map((supplier) => {
               return (<MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>)
            }) 
           } 
          </Select>
        </FormControl>
      </Box>
    );
}

