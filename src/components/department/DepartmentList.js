"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useDepartment } from "@/hooks/api/department";
import DepartmentListSkeleton from "./DepartmentListSkeleton";
import DepartmentListItem from "./DepartmentListItem";
import { useCompanies } from "@/hooks/api/companies";

function DepartmentList({ reloadList, setReloadList }) {
  const { index: getDepartment } = useDepartment("get-all-department");
  const { index: getCompany } = useCompanies();
  const [departmentData, setDepartmentData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getDepartment();
      const { data: companyData } = await getCompany();
      setDepartmentData(data);
      setCompanyData(companyData);
      setLoading(false);
    };
    fetchData();
    if (reloadList) {
      fetchData();
    }
  }, [reloadList]);

  //   companyData && console.log(companyData);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <DepartmentListSkeleton />;
  }

  return (
    <>
      <Paper>
        <TableContainer>
          <Table
            stickyHeader
            sx={{ minWidth: 650 }}
            aria-label="department table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Department</TableCell>
                <TableCell align="center">Company</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departmentData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <DepartmentListItem
                    key={item.id}
                    data={item}
                    companyData={companyData}
                    setReload={setReloadList}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={departmentData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

export default DepartmentList;
