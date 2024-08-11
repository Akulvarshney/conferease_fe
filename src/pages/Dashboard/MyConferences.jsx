import React, { useState, useEffect } from "react";
import { Table, Input, Pagination, Spin, Alert } from "antd";
import axios from "axios";

import { Link } from "react-router-dom";
import {
  capitalizeFirstLetter,
  convertIsoToDate,
} from "../../assets/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyUniqueConferences } from "../../store/slices/myUniqueConferences";

const { Search } = Input;

const MyConferences = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useDispatch();

  const myConferencesState = useSelector((state) => state.myUniqueConferences);

  console.log("conferencesssss", myConferencesState);

  useEffect(() => {
    dispatch(fetchMyUniqueConferences());
  }, []);

  useEffect(() => {
    setData(myConferencesState.data);
  }, [myConferencesState]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <Search
        placeholder="Search"
        onSearch={handleSearchChange}
        style={{ marginBottom: "20px" }}
      />
      {myConferencesState?.status === "loading" && (
        <Spin
          tip="Loading..."
          style={{ display: "block", margin: "20px auto" }}
        />
      )}

      {myConferencesState.error && (
        <Alert
          message={myConferencesState.error}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}
      {myConferencesState.status === "ok" &&
        myConferencesState.error === null && (
          <>
            <Table dataSource={data} rowKey="id" pagination={false}>
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
              total={totalItems}
              onChange={handlePageChange}
              // showSizeChanger
              // onShowSizeChange={(current, size) => handlePageChange(1, size)}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
    </div>
  );
};

export default MyConferences;
