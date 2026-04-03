import {
  Plus,
  Search,
  Funnel,
  SquareArrowOutUpRight,
  Pencil,
  Trash2,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import JobModal from "../../components/JobModal/JobModal";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { axiosClient } from "../../axios/axiosClient";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./Jobs.css";
import EditApplicationModal from "../../components/EditApplicationModal/EditApplicationModal";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [applications, setApplications] = useState([]);
  const [limit] = useState(5);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    jobTitle: "",
    status: "",
    company: "",
  });
  const [selectedApplication, setSelectedApplication] = useState(null);

  const navigate = useNavigate();

  console.log(page);

  useEffect(() => {
    setPage(1);
  }, [filters.company, filters.jobTitle, filters.status]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get(
          `/applications?limit=${limit}&offset=${(page - 1) * limit}&title=${filters.jobTitle}&status=${filters.status}&company=${filters.company}`,
        );

        setApplications(response.data?.applications);
        setPagination(response.data?.pagination);
      } catch (error) {
        console.log("Error in fetching application:", error);
        toast.error("Error occur during fetching applications!");
      }
    })();
  }, [limit, page, filters.jobTitle, filters.status, filters.company]);

  const deleteApplication = async (applicationId) => {
    if (!applicationId) return;

    try {
      await axiosClient.delete(`/applications/${applicationId}`);
      toast.success("Application deleted successfully");

      const response = await axiosClient.get(
        `/applications?limit=${limit}&offset=${(page - 1) * limit}&title=${filters.jobTitle}&status=${filters.status}&company=${filters.company}`,
      );

      if (
        !response?.data?.applications ||
        response?.data?.applications?.length === 0
      ) {
        setPage((prev) => prev - 1);
      } else {
        setApplications(response?.data?.applications);
        setPagination(response?.data?.pagination);
      }
    } catch (error) {
      console.log("Error in deleteApplication:", error);
      toast.error("Failed to delete application!");
    }
  };

  return (
    <div>
      <Header />

      {isAddingJob ? (
        <JobModal
          setIsAddingJob={setIsAddingJob}
          applications={applications}
          setApplications={setApplications}
          setPagination={setPagination}
          limit={limit}
          page={page}
        />
      ) : (
        ""
      )}

      {selectedApplication ? (
        <EditApplicationModal
          selectedApplication={selectedApplication}
          setSelectedApplication={setSelectedApplication}
          setApplications={setApplications}
          setPagination={setPagination}
          limit={limit}
          page={page}
        />
      ) : (
        ""
      )}

      <div className="bg-gray-100 dark:bg-zinc-800 min-h-screen">
        <div className="p-4 max-w-4xl m-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl dark:text-white font-bold">
                Job Applications
              </h2>
              <p className="text-slate-500 mt-1">
                {pagination.totalRecords} total application(s)
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsAddingJob(true)}
                className="flex items-center justify-center bg-blue-700 text-white py-1 px-2 rounded-lg"
              >
                <span className="mr-1">
                  <Plus size={15} className="h-fit" />
                </span>
                Add Job
              </button>
            </div>
          </div>
          {/* filter section */}
          <div className="flex gap-2 flex-wrap mt-3">
            <div className="flex items-center relative mt-2">
              <Search size={15} className="absolute ml-2 text-slate-500" />
              <input
                className="p-1 pl-7 border-2 rounded-lg"
                type="text"
                value={filters.jobTitle}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, jobTitle: e.target.value }));
                }}
                name="title"
                id="title"
                placeholder="Search job title..."
              />
            </div>
            <div className="flex relative">
              <Funnel size={15} className="absolute top-3 ml-1" />
              <select
                className="p-1 pl-6 bg-white rounded-lg"
                name="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                id="status"
              >
                <option value="all">All Statuses</option>
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-center relative mt-2">
              <Search size={15} className="absolute ml-2 text-slate-500" />
              <input
                className="p-1 pl-7 border-2 rounded-lg"
                type="text"
                name="title"
                value={filters.company}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, company: e.target.value }))
                }
                id="title"
                placeholder="Filter company..."
              />
            </div>
          </div>
          <div className="mt-3 overflow-auto">
            <table
              id="applications-table"
              className="w-full text-left border-gray-200 border-2 rounded-lg overflow-hidden"
            >
              <thead>
                <tr className="text-slate-500 text-sm">
                  <th>Company</th>
                  <th>Job Title</th>
                  <th className="hidden md:table-cell">Location</th>
                  <th className="hidden md:table-cell">Salary</th>
                  <th className="hidden md:table-cell">Date Applied</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 dark:text-white">
                {applications && applications.length ? (
                  applications.map((application, index) => (
                    <tr
                      onClick={() => navigate(`/jobs/${application.id}`)}
                      key={index}
                      className="border-b-2 hover:cursor-pointer hover:border-blue-400"
                    >
                      <td>{application.company}</td>
                      <td>{application.jobTitle}</td>
                      <td className="hidden md:table-cell">
                        {application.location}
                      </td>
                      <td className="hidden md:table-cell">
                        {application.salaryRange
                          ? application.salaryRange
                          : "Not Added"}
                      </td>
                      <td className="hidden md:table-cell">
                        {new Date(application.applicationDate).toDateString()}
                      </td>
                      <td>
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="flex justify-end items-center gap-2 w-full h-full">
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          to={application.jobLink ? application.jobLink : "#"}
                        >
                          <SquareArrowOutUpRight size={15} />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplication(application);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteApplication(application.id);
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={7}>
                      no applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div id="pagination" className="mt-3">
            <p className="text-center dark:text-white">
              Showing {pagination?.start} to {pagination?.end} of{" "}
              {pagination?.totalRecords} entries
            </p>
            <div className="flex justify-center gap-2 mt-1">
              <button
                onClick={() => {
                  setPage((prev) => prev - 1);
                }}
                className={`flex items-center gap-1 rounded-lg ${pagination?.hasPrevPage ? "bg-gray-300" : "bg-gray-200"} ${pagination?.hasPrevPage ? "cursor-default" : "cursor-not-allowed"} hover:bg-gray-400 p-1`}
                disabled={pagination?.hasPrevPage ? false : true}
              >
                <span>
                  <MoveLeft size={15} />
                </span>
                Previous
              </button>
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                className={`flex items-center gap-1 rounded-lg ${pagination?.hasNextPage ? "bg-gray-300" : "bg-gray-200"} ${pagination.hasNextPage ? "cursor-default" : "cursor-not-allowed"} hover:bg-gray-400 p-1`}
                disabled={pagination.hasNextPage ? false : true}
              >
                Next
                <span>
                  <MoveRight size={15} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
