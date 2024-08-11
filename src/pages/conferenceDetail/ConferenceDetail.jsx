import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConferenceDetails } from "../../store/slices/conferenceSlice";
import { Link, useParams } from "react-router-dom";
import { userRoleForConference } from "../../store/slices/userRoleForConference";
import { Select, Spin, Table, Button, Modal } from "antd";
import { userConfereceBasedOnRole } from "../../store/slices/userConfereceBasedOnRole";
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterStatus,
} from "../../assets/constants";
import ReviewsModal from "./ReviewsModal";

const { Option } = Select;

const ConferenceDetails = () => {
  const dispatch = useDispatch();
  const { confId } = useParams();

  // Local States
  const [userRolesList, setUserRolesList] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [userConfereceBasedOnRoleList, setUserConfereceBasedOnRoleList] =
    useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  // Store States
  const conferenceData = useSelector((state) => state.conferenceDetail);
  const userRoles = useSelector((state) => state.userRoleForConference);
  const userConfereceBasedOnRoleListState = useSelector(
    (state) => state.userConfereceBasedOnRole
  );
  const myConferencesState = useSelector((state) => state.myUniqueConferences);

  useEffect(() => {
    if (confId) {
      setSelectedId(confId);
      dispatch(fetchConferenceDetails(confId));
      dispatch(userRoleForConference(confId));
    }
    if (confId) {
    }
  }, [confId]);

  useEffect(() => {
    if (userConfereceBasedOnRoleListState?.status === "ok") {
      setUserConfereceBasedOnRoleList(userConfereceBasedOnRoleListState?.data);
    }
  }, [userConfereceBasedOnRoleListState]);

  useEffect(() => {
    if (selectedRoleId) {
      let payload = {
        conferenceId: confId,
        role: capitalizeFirstLetter(selectedRoleId),
      };
      dispatch(userConfereceBasedOnRole(payload));
    }
  }, [selectedRoleId]);

  useEffect(() => {
    if (userRoles.status === "ok") {
      const roles = userRoles?.data?.data || [];
      const defaultRoles = [
        { id: "reviewer", role: "Reviewer" },
        { id: "chair", role: "Chair" },
        { id: "author", role: "Author" },
      ];

      const filteredRoles = defaultRoles.map((defaultRole) => {
        const foundRole = roles.find(
          (role) => role.role.toLowerCase() === defaultRole.role.toLowerCase()
        );
        return foundRole
          ? { ...foundRole, role: capitalizeFirstLetter(foundRole.role) }
          : defaultRole;
      });

      setUserRolesList(filteredRoles);

      if (filteredRoles.length > 0) {
        setSelectedRoleId(filteredRoles[0].role.toLowerCase());
      }
    }
  }, [userRoles]);

  const handleChange = (value) => {
    setSelectedRoleId(value.toLowerCase());
  };

  const showReviewModal = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedReview(null);
  };

  const columns = [
    {
      title: "Paper Name",
      dataIndex: "paperName",
      key: "paperName",
    },
    {
      title: "Track",
      dataIndex: ["track", "name"],
      key: "track",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => capitalizeFirstLetterStatus(text),
    },
    {
      title: "Download Paper",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (text, record) => (
        <a target="_blank" href={record.fileUrl} download>
          Download
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          {record.reviews && record.reviews.length > 0 && (
            <Button type="link" onClick={() => showReviewModal(record.reviews)}>
              View Reviews
            </Button>
          )}
          <Button type="link">
            {/* onClick={() => editSubmission(record.id)} */}
            Edit Submission
          </Button>
          <Button type="link" danger>
            {/* onClick={() => deleteSubmission(record.id)} */}
            Delete Submission
          </Button>
        </div>
      ),
    },
  ];

  if (
    conferenceData.status === "loading" ||
    userRoles.status === "loading" ||
    userConfereceBasedOnRoleListState.status === "loading"
  ) {
    return (
      <div className="fullPageLoading">
        <Spin tip="Loading..." />
      </div>
    );
  }

  if (conferenceData.status === "failed")
    return <div>Error: {conferenceData.error}</div>;

  return (
    <div className="pageContainer">
      <div className="conferenceDetail_row1">
        <h1>{conferenceData?.data?.data?.handle}</h1>
        <div className="conferenceDetail_row1_right">
          {selectedRoleId === "author" && (
            <Link to="/createSubmission" state={{ confId: confId }}>
              <Button type="primary">Create New Submission</Button>
            </Link>
          )}

          <Select
            placeholder="Select a Conference"
            // style={{ width: 200 }}
            value={selectedId}
            onChange={handleChange}
          >
            {myConferencesState?.data?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.handle}
              </Select.Option>
            ))}
          </Select>

          <Select
            // style={{ width: 200 }}
            placeholder="Select a role"
            value={capitalizeFirstLetter(selectedRoleId)}
            onChange={handleChange}
          >
            {userRolesList?.map((item) => (
              <Option key={item.id} value={item.role.toLowerCase()}>
                {capitalizeFirstLetter(item.role)}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {userConfereceBasedOnRoleList && selectedRoleId === "author" && (
        <div style={{ marginTop: "2rem" }}>
          <Table
            columns={columns}
            dataSource={userConfereceBasedOnRoleList}
            rowKey="id"
          />
        </div>
      )}

      {userConfereceBasedOnRoleList && selectedRoleId === "chair" && (
        <div style={{ marginTop: "2rem" }}>
          <Table
            columns={columns}
            dataSource={userConfereceBasedOnRoleList}
            rowKey="id"
          />
        </div>
      )}

      {userConfereceBasedOnRoleList && selectedRoleId === "reviewer" && (
        <div style={{ marginTop: "2rem" }}>
          <Table
            columns={columns}
            dataSource={userConfereceBasedOnRoleList}
            rowKey="id"
          />
        </div>
      )}

      <ReviewsModal
        isModalVisible={isModalVisible}
        handleModalOk={handleModalOk}
        selectedReview={selectedReview}
      />
    </div>
  );
};

export default ConferenceDetails;
