"use client";

import AllConferences from "@/components/AllConferences";
import MyConferences from "@/components/MyConferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="pageContainer">
      <p className=" text-2xl ">Conference List</p>

      <Tabs defaultValue="myConferences">
        <TabsList className="my-5">
          <TabsTrigger value="myConferences">My Conferences</TabsTrigger>
          <TabsTrigger value="allConferences">All Conferences</TabsTrigger>
        </TabsList>

        <TabsContent value="myConferences">
          <MyConferences />
        </TabsContent>

        <TabsContent value="allConferences">
          <AllConferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
