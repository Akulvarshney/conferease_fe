import React from "react";
import { Tabs } from "antd";
import AllConferences from "./AllConferences";
import MyConferences from "./MyConferences";

const { TabPane } = Tabs;

const Dashboard = () => {
  return (
    <div className="pageContainer">
      <Tabs defaultActiveKey="1" className="my-5">
        <TabPane tab="My Conferences" key="1">
          <MyConferences />
        </TabPane>
        <TabPane tab="All Conferences" key="2">
          <AllConferences />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
