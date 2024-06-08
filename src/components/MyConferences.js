"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  Paper,
} from "@mui/material";
import axios from "axios";
import { convertIsoToDate, LOCAL_URL } from "@/app/constants";
import Link from "next/link";

const MyConferences = () => {
  let userData;
  useEffect(() => {
    userData = JSON.parse(localStorage?.getItem("userData"));
  }, []);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${LOCAL_URL}/myConferences?userId=${userData._id}&page=${
            page + 1
          }&limit=${rowsPerPage}&search=${search}`
        );
        setData(response.data.data.conferences);
        setTotalItems(response.data.data.totalConferences);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px" }}
      />
      {loading && <div className="flex justify-center">Loading...</div>}
      {error && <div className="flex justify-center">{error}</div>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Start Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((conference) => (
                <TableRow key={conference._id}>
                  <TableCell>
                    <Link href={`/conDetail?Confid=${conference._id}`}>
                      {conference.name}
                    </Link>
                  </TableCell>
                  <TableCell>{conference.location}</TableCell>
                  <TableCell>
                    {convertIsoToDate(conference.startDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default MyConferences;
