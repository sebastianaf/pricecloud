import React from "react";
import DefaultLayout from "../layout/DefaultLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <DashboardLayout>
          <div className="min-h-[800px]">
            <div className="text-lg md:text-xl font-bold m-3 md:m-5">
              Dashboard
            </div>
          </div>
        </DashboardLayout>
      </DefaultLayout>
    </ProtectedRoute>
  );
};
export default Dashboard;
