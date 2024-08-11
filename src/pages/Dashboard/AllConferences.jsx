import React, { useEffect, useState } from "react";
import { Table, Input, Pagination, Spin, Alert } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  capitalizeFirstLetter,
  convertIsoToDate,
} from "../../assets/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllConferenceList } from "../../store/slices/allConferenceSlice";

const { Search } = Input;

const AllConferences = () => {
  const dispatch = useDispatch();
  const [conferences, setConferences] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLeft, setTotalLeft] = useState(0);
  const [error, setError] = useState("");

  const allConferenceList = useSelector((state) => state.allConferenceList);

  useEffect(() => {
    dispatch(fetchAllConferenceList({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    if (allConferenceList.status === "ok") {
      setConferences(allConferenceList?.conferenceData?.conferenceinfo);
      setTotalLeft(allConferenceList?.conferenceData?.totalLeft);
    } else if (allConferenceList.status === "failed") {
      setError(allConferenceList?.error);
    }
  }, [allConferenceList]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const totalPages = totalLeft > 0 ? Math.ceil(totalLeft / pageSize) : 0;

  return (
    <div>
      <Search
        placeholder="Search"
        onSearch={handleSearchChange}
        style={{ marginBottom: "20px" }}
      />

      {allConferenceList?.status === "loading" && (
        <Spin
          tip="Loading..."
          style={{ display: "block", margin: "20px auto" }}
        />
      )}

      {allConferenceList.error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}

      {allConferenceList.status === "ok" && !allConferenceList.error && (
        <>
          <Table dataSource={conferences} rowKey="id" pagination={false}>
            <Table.Column
              title="Name"
              dataIndex="handle"
              key="handle"
              render={(text, record) => (
                <Link to={`/conferenceDetail/${record.id}`}>{text}</Link>
              )}
            />
            <Table.Column
              title="Location"
              dataIndex="location"
              key="location"
            />
            <Table.Column
              title="Start Date"
              dataIndex="startDate"
              key="startDate"
              render={(date) => convertIsoToDate(date)}
            />
            <Table.Column
              title="Event Type"
              dataIndex="eventType"
              key="eventType"
              render={(data) => capitalizeFirstLetter(data)}
            />
            <Table.Column
              title="Website Link"
              dataIndex="websiteUrl"
              key="websiteUrl"
              render={(url) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              )}
            />
          </Table>

          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalLeft}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default AllConferences;
