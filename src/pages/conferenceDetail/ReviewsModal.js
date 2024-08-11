import { Button, Modal, Table } from "antd";
import React from "react";

const ReviewsModal = (props) => {
  const reviewColumns = [
    {
      title: "Verdict",
      dataIndex: "verdict",
      key: "verdict",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];
  return (
    <Modal
      title="Review Details"
      onClose={props.handleModalOk}
      visible={props.isModalVisible}
      footer={[
        <Button key="ok" type="primary" onClick={props.handleModalOk}>
          OK
        </Button>,
      ]}
    >
      {props.selectedReview && (
        <Table
          columns={reviewColumns}
          dataSource={props.selectedReview}
          pagination={false}
          rowKey="id"
        />
      )}
    </Modal>
  );
};

export default ReviewsModal;
