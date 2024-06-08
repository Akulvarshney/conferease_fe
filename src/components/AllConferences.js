"use client";
import React, { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  TablePagination,
} from "@mui/material";

import { useState } from "react";
import axios from "axios";
import { convertIsoToDate, LOCAL_URL } from "@/app/constants";
import Link from "next/link";

const AllConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // Note: Page index starts from 0 in TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalConferences, setTotalConferences] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConferences = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${LOCAL_URL}/allConferences`, {
          params: { page: page + 1, limit: rowsPerPage, search },
        });
        console.log(response.data.data.conferences);
        setConferences(response.data.data.conferences);
        setTotalConferences(response.data.data.totalConferences);
      } catch (err) {
        setError("No Result");
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [page, rowsPerPage, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
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
      {loading && (
        <div className=" flex justify-center text-center ">Loading...</div>
      )}
      {error && <div className="flex justify-center text-center">{error}</div>}
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
              {conferences.map((conference) => (
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
            count={totalConferences}
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

export default AllConferences;
