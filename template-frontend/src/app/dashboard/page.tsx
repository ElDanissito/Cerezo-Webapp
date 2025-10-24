import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/admin/tramites/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/admin/tramites/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/tramites/MonthlySalesChart";
import StatisticsChart from "@/components/admin/tramites/StatisticsChart";
import RecentOrders from "@/components/admin/tramites/RecentOrders";
import DemographicCard from "@/components/admin/tramites/DemographicCard";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}