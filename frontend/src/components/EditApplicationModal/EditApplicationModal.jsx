import { useEffect, useState, useRef } from "react";
import { axiosClient } from "../../axios/axiosClient";
import toast from "react-hot-toast";
import { X } from "lucide-react";

function EditApplicationModal({
  selectedApplication,
  setSelectedApplication,
  setApplications,
  setPagination,
  limit,
  offset,
}) {
  const [company, setCompany] = useState(selectedApplication.company);
  const [jobTitle, setJobTitle] = useState(selectedApplication.jobTitle);
  const [location, setLocation] = useState(selectedApplication.location);
  const [salaryRange, setSalaryRange] = useState(
    selectedApplication.salaryRange,
  );
  const [jobLink, setJobLink] = useState(selectedApplication.jobLink);
  const [status, setStatus] = useState(selectedApplication.status);
  const [applicationDate, setApplicationDate] = useState(
    selectedApplication.applicationDate,
  );
  const [resumeVersion, setResumeVersion] = useState(
    selectedApplication.resumeVersion,
  );
  const [resumeVersions, setResumeVersions] = useState([]);
  const [jobDescription, setJobDescription] = useState(
    selectedApplication.jobDescription,
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    (async () => {
      try {
        const response = await axiosClient.get("/users/profile/resumes");

        setResumeVersions(response?.data);
      } catch (error) {
        console.log("Error during loading resumes:", error);
        toast.error("Failed to load resumes");
      }
    })();

    return () => (document.body.style.overflow = "auto");
  }, []);

  const modalOverlayRef = useRef();

  const editApplication = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/applications/${selectedApplication.id}`, {
        company,
        jobTitle,
        location,
        salaryRange,
        jobLink,
        status,
        applicationDate,
        resumeVersion,
        jobDescription,
      });

      const response = await axiosClient.get(
        `/applications?limit=${limit}&offset=${offset}`,
      );

      setApplications(response?.data?.applications);
      setPagination(response?.data?.pagination);

      toast.success("Profile Delete successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error occur in adding applciation!");
    } finally {
      setSelectedApplication(null);
    }
  };

  return (
    <div
      id="modal-overlay"
      ref={modalOverlayRef}
      onClick={(e) => {
        if (modalOverlayRef.current === e.target) setSelectedApplication(null);
      }}
      className="flex fixed top-0 left-0 z-20 justify-center items-center bg-slate-800/50 w-screen h-screen"
    >
      <div
        id="modal"
        className="relative p-3 bg-white dark:bg-zinc-800 opacity-100 z-40 rounded-xl"
      >
        <X
          onClick={() => setSelectedApplication(null)}
          size={20}
          className="absolute top-2 right-2 active:border-blue-500 active:border-2 rounded-lg dark:text-white"
        />
        <form onSubmit={(e) => editApplication(e)} className="p-2">
          <p className="text-lg font-semibold dark:text-white">
            Edit Application
          </p>
          <div className="flex gap-2 mt-4">
            <div>
              <label className="font-medium dark:text-white" htmlFor="company">
                Company <sup>*</sup>
              </label>
              <br />
              <input
                className="w-full border-2 rounded-lg p-1"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                name="company"
                id="company"
                placeholder="e.g. Microsoft"
                required
              />
            </div>
            <div>
              <label className="font-medium dark:text-white" htmlFor="title">
                Job Title <sup>*</sup>
              </label>
              <br />
              <input
                className="w-full border-2 rounded-lg p-1"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                name="title"
                id="title"
                placeholder="e.g. SDE1"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label className="font-medium dark:text-white" htmlFor="location">
                Location <sup>*</sup>
              </label>
              <br />
              <input
                className="w-full border-2 rounded-lg p-1"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                name="location"
                id="location"
                placeholder="e.g. Remote"
                required
              />
            </div>
            <div>
              <label
                className="font-medium dark:text-white"
                htmlFor="salaryRange"
              >
                Salary Range
              </label>
              <br />
              <input
                className="w-full border-2 rounded-lg p-1"
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                name="salaryRange"
                id="salaryRange"
                placeholder="e.g. 10LPA - 15LPA"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-medium dark:text-white" htmlFor="jobLink">
              Job Link
            </label>
            <input
              className="w-full border-2 rounded-lg p-1"
              type="url"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              name="jobLink"
              id="jobLink"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="w-full">
              <label className="font-medium dark:text-white" htmlFor="status">
                Status
              </label>
              <br />
              <select
                className="w-full p-1 rounded-lg bg-white border-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                name="status"
                id="status"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="w-full">
              <label
                className="font-medium dark:text-white"
                htmlFor="applicationDate"
              >
                Date Applied <sup>*</sup>
              </label>
              <br />
              <input
                className="w-full box-border border-2 rounded-lg p-1"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                name="applicationDate"
                id="applicationDate"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="w-full">
              <label
                className="font-medium dark:text-white"
                htmlFor="resumeVersion"
              >
                Resume Version <sup>*</sup>
              </label>
              <br />
              <select
                className="bg-white p-1 border-2 rounded-lg"
                name="resumeVersion"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
                id="resumeVersion"
              >
                {resumeVersions && resumeVersions.length ? (
                  resumeVersions.map((resume, index) => (
                    <option
                      key={index}
                      value={resume.version}
                    >
                      {resume.version}
                    </option>
                  ))
                ) : (
                  <option value="none">Select resume</option>
                )}
              </select>
              {/* <input
                className="w-full box-border border-2 rounded-lg p-1"
                type="text"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
                name="resumeVersion"
                id="resumeVersion"
                placeholder="e.g. Resume v1-Engineering"
                required
              /> */}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="w-full">
              <label
                className="font-medium dark:text-white"
                htmlFor="description"
              >
                Job Description / Notes
              </label>
              <br />
              <textarea
                className="w-full border-2 rounded-lg p-1"
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                name="description"
                id="description"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setSelectedApplication(null)}
              className="border-2 rounded-lg p-1 hover:bg-slate-100 dark:text-white dark:hover:bg-zinc-700 dark:border-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white rounded-lg p-1"
            >
              Update Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditApplicationModal;
