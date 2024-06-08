"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const ConferenceDetail = () => {
  const searchParam = useSearchParams();
  const id = searchParam.get("Confid");

  return <div className="pageContainer">{id}</div>;
};

export default ConferenceDetail;
