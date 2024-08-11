import React, { useEffect, useState } from "react";
import countryCodes from "../../assets/callingCode.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

const RegistrationUserForm = () => {
  const token = localStorage?.getItem("token");
  const navigate = useNavigate();

  // Individual state for each input
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [orcidId, setOrcidId] = useState("");

  const [form] = Form.useForm(); // Initialize the form instance

  useEffect(() => {
    // Fetch email from localStorage or use fallback
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      form.setFieldsValue({ email: storedEmail }); // Set form value for email
    } else {
      const userDetails = JSON.parse(localStorage.getItem("userData")) || {};
      setEmail(userDetails?.email || "");
      form.setFieldsValue({ email: userDetails?.email || "" }); // Set form value for email
    }
  }, [form]);

  const handleValuesChange = (changedValues) => {
    if (changedValues.email) setEmail(changedValues.email);
    if (changedValues.name) setName(changedValues.name);
    if (changedValues.affiliation) setAffiliation(changedValues.affiliation);
    if (changedValues.countryCode) setCountryCode(changedValues.countryCode);
    if (changedValues.mobileNumber) setMobileNumber(changedValues.mobileNumber);
    if (changedValues.linkedinProfile)
      setLinkedinProfile(changedValues.linkedinProfile);
    if (changedValues.orcidId) setOrcidId(changedValues.orcidId);
  };

  const submitRegistration = (values) => {
    let data = JSON.stringify({
      name: values.name,
      affiliation: values.affiliation,
      mobileNumber: values.mobileNumber,
      countryCode: values.countryCode,
      linkedinProfile: values.linkedinProfile,
      orcidId: values.orcidId,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "https://conferease-backend.onrender.com/api/v1/user/profile/set",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Response:", JSON.stringify(response.data));
        message.success("Registration successful!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log("Error:", error);
        message.error("Registration failed!");
      });
  };

  return (
    <div className="pageContainer">
      <div className="registrationForm">
        <h2>Register User</h2>
        <Form
          form={form} // Pass form instance to Form component
          layout="vertical"
          className="loginFormContainer"
          onValuesChange={handleValuesChange}
          onFinish={submitRegistration}
          initialValues={{
            email,
            name,
            affiliation,
            countryCode,
            mobileNumber,
            linkedinProfile,
            orcidId,
          }}
        >
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Affiliation"
            name="affiliation"
            rules={[
              { required: true, message: "Please enter your affiliation!" },
            ]}
          >
            <Input placeholder="Affiliation" />
          </Form.Item>
          <Form.Item
            label="Country Code"
            name="countryCode"
            rules={[
              { required: true, message: "Please select your country code!" },
            ]}
          >
            <Select placeholder="Select Country Code">
              {countryCodes?.countries?.map((code, index) => (
                <Option key={index} value={code.code}>
                  {code.name} ({code.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[
              { required: true, message: "Please enter your mobile number!" },
            ]}
          >
            <Input placeholder="Mobile Number" type="tel" />
          </Form.Item>
          <Form.Item
            label="LinkedIn Profile"
            name="linkedinProfile"
            rules={[{ type: "url", message: "Please enter a valid URL!" }]}
          >
            <Input placeholder="LinkedIn Profile" />
          </Form.Item>
          <Form.Item label="ORCID ID" name="orcidId">
            <Input placeholder="ORCID ID" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegistrationUserForm;
