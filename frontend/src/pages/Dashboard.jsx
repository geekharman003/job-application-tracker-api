import { Briefcase, Users, Trophy, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Header from "../components/Header/Header.jsx";
import { axiosClient } from "../axios/axiosClient.js";
import PieChartComponent from "../components/PieChart/PieChartComponent.jsx";
import FunnelChartComponent from "../components/FunnelChart/FunnelChartComponent.jsx";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalApplications: 0,
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    responseRate: 0,
    offerRate: 0,
    activePipeLine: 0,
  });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get("/dashboard/summary");
        const data = response?.data;

        setSummary(() => ({
          totalApplications: data?.summary?.totalApplications,
          saved: data?.summary?.saved,
          applied: data?.summary?.applied,
          interview: data?.summary?.interview,
          offer: data?.summary?.offer,
          rejected: data?.summary?.rejected,
          responseRate: data?.summary?.responseRate,
          offerRate: data?.summary?.offerRate,
          activePipeLine: data?.summary?.activePipeLine,
        }));

        setApplications(data?.applications);
      } catch (error) {
        console.log("Error:", error);
        toast.error("Failed to load summary");
      }
    })();
  }, []);

  const pieChartData = [
    { name: "saved", value: summary.saved, fill: "#3887ff" },
    {
      name: "applied",
      value: summary.applied,
      fill: "#ff9900",
    },
    {
      name: "interview",
      value: summary.interview,
      fill: "#ad46ff",
    },
    {
      name: "offer",
      value: summary.offer,
      fill: "#00c950",
    },
    {
      name: "rejected",
      value: summary.rejected,
      fill: "#ef4444",
    },
  ];

  const funnelChartData = [
    {
      name: "saved",
      value: summary.saved,
      fill: "#3887ff",
    },
    {
      name: "applied",
      value: summary.applied,
      fill: "#ff9900",
    },
    {
      name: "interview",
      value: summary.interview,
      fill: "#ad46ff",
    },
    {
      name: "offer",
      value: summary.offer,
      fill: "#00c950",
    },
  ];

  return (
    <>
      <Header />
      <div className="bg-gray-100 dark:bg-zinc-800 min-h-screen">
        <div className="max-w-4xl m-auto p-4">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Dashboard</h2>
            <p className="text-slate-500">Track your job search progress</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div className="flex justify-between p-5 bg-white dark:bg-zinc-900 rounded-lg">
              <div>
                <p className="text-slate-500">Total Applications</p>
                <p className="text-2xl dark:text-white font-semibold">
                  {summary.totalApplications}
                </p>
              </div>
              <div>
                <span
                  className="inline-flex p-1
                rounded-lg bg-blue-200 text-blue-500"
                >
                  <Briefcase />
                </span>
              </div>
            </div>
            <div className="flex justify-between dark:bg-zinc-900 p-5 bg-white rounded-lg">
              <div>
                <p className="text-slate-500">Interviews</p>
                <p className="text-2xl dark:text-white font-semibold">
                  {summary.interview}
                </p>
                <p className="text-sm text-slate-500">
                  {summary.responseRate}% response rate
                </p>
              </div>
              <div>
                <span
                  className="inline-flex p-1
                rounded-lg bg-purple-200 text-purple-500"
                >
                  <Users />
                </span>
              </div>
            </div>
            <div className="flex justify-between p-5 bg-white dark:bg-zinc-900 rounded-lg">
              <div>
                <p className="text-slate-500">Offers</p>
                <p className="text-2xl dark:text-white font-semibold">
                  {summary.offer}
                </p>
                <p className="text-sm text-slate-500">
                  {summary.offerRate}% offer rate
                </p>
              </div>
              <div>
                <span
                  className="inline-flex p-1
                rounded-lg bg-green-200 text-green-500"
                >
                  <Trophy />
                </span>
              </div>
            </div>
            <div className="flex justify-between p-5 bg-white dark:bg-zinc-900 rounded-lg">
              <div>
                <p className="text-slate-500">Rejections</p>
                <p className="text-2xl dark:text-white font-semibold">
                  {summary.rejected}
                </p>
              </div>
              <div>
                <span
                  className="inline-flex p-1
                rounded-lg bg-red-200 text-red-500"
                >
                  <CircleX />
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="flex justify-center items-center w-full md: gap-2 p-5 bg-white dark:bg-zinc-900 rounded-lg">
              <div className="text-center">
                <p className="text-slate-500">Response Rate</p>
                <p className="text-2xl dark:text-white font-semibold">
                  {summary.responseRate}%
                </p>
                <p className="text-slate-500 text-sm">
                  Interviews + Offers + Rejections / Total Applications
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center w-full gap-2 p-5 bg-white dark:bg-zinc-900 rounded-lg">
              <div className="text-center">
                <p className="text-slate-500">Offer Rate</p>
                <p className="text-2xl font-semibold text-green-500">
                  {summary.offerRate}%
                </p>
                <p className="text-slate-500 text-sm">Offers / Interviews</p>
              </div>
            </div>
            <div className="flex justify-center items-center w-full gap-2 p-5 bg-white dark:bg-zinc-900 rounded-lg">
              <div className="text-center">
                <p className="text-slate-500">Active Pipeline</p>
                <p className="text-2xl font-semibold text-blue-500">
                  {summary.activePipeLine}
                </p>
                <p className="text-slate-500 text-sm">
                  Saved + Applied + Interview
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="bg-white dark:bg-zinc-900 p-3">
              <p className="font-semibold dark:text-white">
                Recent Applications
              </p>
              {applications && applications.length ? (
                applications.map((application, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-slate-100 dark:bg-zinc-800 mt-2 p-3 py-5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium dark:text-white">
                        {application.jobTitle}
                      </p>
                      <p className="text-slate-500">{application?.company}</p>
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">
                        {application.applicationDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center dark:text-slate-500">
                  No applications found
                </p>
              )}
            </div>
            <div className="bg-white dark:bg-zinc-900 p-3">
              <p className="font-semibold dark:text-white">
                Status Distribution
              </p>
              <div className="flex justify-center items-center">
                {summary.applied ||
                summary.interview ||
                summary.offer ||
                summary.rejected ||
                summary.saved ? (
                  <PieChartComponent data={pieChartData} />
                ) : (
                  <p className="dark:text-slate-500">No applications found</p>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 md:col-span-2 p-3">
              <p className="font-semibold dark:text-white">
                Application Funnel
              </p>
              <div className="flex justify-center items-center mt-3">
                {summary.applied ||
                summary.interview ||
                summary.offer ||
                summary.rejected ||
                summary.saved ? (
                  <FunnelChartComponent data={funnelChartData} />
                ) : (
                  <p className="dark:text-slate-500">No applications found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
