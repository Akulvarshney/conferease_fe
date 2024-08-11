import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Upload,
  Space,
  Select,
  Table,
  notification,
  Spin,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { submitPaper } from "../../store/slices/createSubmission";
import { fetchTracksAndConfDetails } from "../../store/slices/tracksListSlice";
import { useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateNewSubmission = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const confid = location.state.confId || "";
  const { status, error } = useSelector((state) => state.submitPaper);
  const tracksState = useSelector((state) => state.tracksListAndConfDetails);

  useEffect(() => {
    dispatch(fetchTracksAndConfDetails(confid));
  }, [dispatch, confid]);

  const initialEmail = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")).email
    : "";

  const [authorEmails, setAuthorEmails] = useState([initialEmail]);
  const [file, setFile] = useState(null);

  const handleAuthorEmailChange = (index, e) => {
    const newEmails = [...authorEmails];
    newEmails[index] = e.target.value;
    setAuthorEmails(newEmails);
  };

  const addAuthorEmailField = () => {
    setAuthorEmails([...authorEmails, ""]);
  };

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleSubmit = async (values) => {
    if (file) {
      const data = {
        paperName: values.paperName,
        authorEmails,
        trackId: values.trackId,
        conferenceId: confid,
        file: file,
      };

      try {
        const resultAction = await dispatch(submitPaper(data));
        if (submitPaper.fulfilled.match(resultAction)) {
          // navigate(`/conferenceDetail/${confid}`);
          notification.success({
            message: "Success",
            description: "Paper submitted successfully.",
          });
        } else {
          notification.error({
            message: "Error",
            description:
              resultAction.payload?.message ||
              "An error occurred while submitting the paper.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "An unexpected error occurred.",
        });
      }
    } else {
      notification.error({
        message: "Error",
        description: "Please upload the paper!",
      });
    }
  };

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleAuthorEmailChange(index, e)}
          disabled={index === 0}
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const dataSource = authorEmails.map((email, index) => ({
    key: index,
    index: index + 1,
    email: email,
  }));

  if (status === "loading") {
    return (
      <div className="fullPageLoading">
        <Spin tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <h1>New Submission ({tracksState?.data?.handle})</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Paper Name"
          name="paperName"
          rules={[{ required: true, message: "Please input the paper name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Author Emails">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="small"
            footer={() =>
              authorEmails.length < 5 ? (
                <Button
                  type="dashed"
                  onClick={addAuthorEmailField}
                  icon={<PlusOutlined />}
                >
                  Add Another Email
                </Button>
              ) : null
            }
          />
        </Form.Item>

        <Form.Item
          label="Track"
          name="trackId"
          rules={[{ required: true, message: "Please select a track!" }]}
        >
          <Select placeholder="Select a track">
            {tracksState?.data?.tracks?.map((track) => (
              <Option key={track.id} value={track.id}>
                {track.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Upload Paper"
          rules={[{ required: true, message: "Please upload the paper!" }]}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            accept=".pdf"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {/* {file && <p>File selected: {file.name}</p>} */}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={status === "loading"}
          >
            Submit Paper
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateNewSubmission;
