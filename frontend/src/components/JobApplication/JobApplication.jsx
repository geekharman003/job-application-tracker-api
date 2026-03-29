import { MoveLeft, Pencil, Plus, Bell, Trash2, Clock } from "lucide-react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  FileText,
} from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosClient } from "../../axios/axiosClient";
import toast from "react-hot-toast";

function JobApplication() {
  const { id } = useParams();

  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocaiton] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [status, setStatus] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [resumeVersion, setResumeVersion] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(null);
  const [reminder, setReminder] = useState({
    message: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [reminders, setReminders] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get(`/applications/${id}`);

        const data = response.data;

        setCompany(data?.name);
        setJobTitle(data?.jobTitle);
        setLocaiton(data?.location);
        setSalaryRange(data?.salaryRange);
        setApplicationDate(data?.applicationDate);
        setStatus(data?.status);
        setJobLink(data?.jobLink);
        setResumeVersion(data?.resumeVersion);
        setJobDescription(data?.jobDescription);
        setNotes(data?.notes);
        setReminders(data?.reminders);
      } catch (error) {
        console.log("Error loading application data:", error);
      }
    })();
  }, [id]);

  const addNote = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post(`/applications/${id}/notes`, {
        note,
      });

      setNotes((prev) => [...prev, response.data]);
      toast.success("Note added successfully");
    } catch (error) {
      console.log("Error in addNote:", error);
      toast.error("Failed to add note");
    } finally {
      setNote("");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axiosClient.delete(`/applications/${id}/notes/${noteId}`);

      setNotes(
        notes.filter((note) => {
          return note.id !== noteId;
        }),
      );
    } catch (error) {
      console.log("Error in deleteNote:", error);
      toast.error("Failed to delete note");
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post(`/applications/${id}/reminders`, {
        date: reminder.date,
        message: reminder.message,
      });
      setReminders((prev) => [...prev, response.data]);
    } catch (error) {
      console.log("Error in addReminder:", error);
      toast.error("Failed to add reminder");
    } finally {
      setReminder({
        date: new Date().toISOString().split("T")[0],
        message: "",
      });
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      await axiosClient.delete(`/applications/${id}/reminders/${reminderId}`);

      setReminders(reminders.filter((reminder) => reminder.id !== reminderId));
    } catch (error) {
      console.log("Error in deleteReminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div id="job-application" className="p-4 max-w-4xl m-auto">
          <Link
            to={"/jobs"}
            className="inline-flex items-center gap-1 text-xs hover:bg-slate-200 p-1 rounded-lg"
          >
            {" "}
            <span>
              <MoveLeft size={15} />
            </span>{" "}
            Back to Applications
          </Link>
          <div className="flex justify-between flex-wrap gap-2 mt-3">
            <div className="flex gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                <Building2 size={30} />
              </span>
              <div>
                <h2 className="text-2xl font-bold ">{jobTitle}</h2>
                <p className="text-slate-500">{company}</p>
                <p className="flex items-center gap-2 flex-wrap text-slate-500">
                  <span className="inline-flex items-center">
                    <span>
                      <MapPin size={15} />
                    </span>
                    {location}
                  </span>
                  <span className="inline-flex items-center">
                    <span>
                      <IndianRupee size={15} />
                    </span>
                    {salaryRange}
                  </span>
                  <span className="inline-flex items-center">
                    <span>
                      <Calendar size={15} />
                    </span>
                    applied {applicationDate}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <StatusBadge status={status} />
              <Link
                to={jobLink ? jobLink : "#"}
                className="border-2 p-1 rounded-lg"
              >
                View Job
              </Link>
            </div>
          </div>
          {/* job details section */}
          <div className="p-3 bg-white mt-4 rounded-lg border-2">
            <p className="flex items-center gap-1 text-sm font-medium">
              <span>
                <FileText size={15} />
              </span>
              Job Details
            </p>
            <div className="flex mt-2">
              <div className="w-[50%]">
                <p className="text-slate-500">Company</p>
                <p className="font-medium">{company}</p>
              </div>
              <div className="w-[50%]">
                <p className="text-slate-500">Location</p>
                <p className="font-medium">{location}</p>
              </div>
            </div>
            <div className="flex mt-4 pb-3 border-b-2">
              <div className="w-[50%]">
                <p className="text-slate-500">Salary</p>
                <p className="font-medium">{salaryRange || "Not Added"}</p>
              </div>
              <div className="w-[50%]">
                <p className="text-slate-500">Resume Version</p>
                <p className="font-medium">{resumeVersion}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-slate-500">Description</p>
              <p>{jobDescription || "Not Added"}</p>
            </div>
          </div>
          {/* notes section */}
          <div className="p-3 bg-white mt-4 rounded-lg border-2">
            <p className="flex items-center justify-between gap-1 text-sm font-medium">
              <span className="inline-flex items-center">
                <span>
                  <FileText size={15} />
                </span>
                Notes
              </span>
              {notes && notes.length ? notes.length : 0} note(s)
            </p>
            <div className="flex flex-col mt-2">
              <form onSubmit={(e) => addNote(e)}>
                <textarea
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  id="note"
                  placeholder="Add a note (interview feedback,questions asked etc)"
                  rows={6}
                  className="w-full p-2 rounded-lg border-2"
                  required
                ></textarea>
                <button
                  type="submit"
                  className={`flex items-center text-sm ${note.trim() ? "bg-blue-700" : "bg-blue-400"} text-white p-1 rounded-lg mt-2`}
                  disabled={note.trim() ? false : true}
                >
                  <span>
                    <Plus size={15} />
                  </span>
                  Add Note
                </button>
              </form>
              {notes && notes.length ? (
                notes.map((note, index) => (
                  <div key={index} className="bg-slate-100 p-2 mt-4 rounded-lg">
                    <p className="flex justify-between">
                      {note.note}
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="hover:text-red-500"
                      >
                        <span>
                          <Trash2 size={15} />
                        </span>
                      </button>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500">No notes yet</p>
              )}
            </div>
          </div>
          {/* reminders section */}
          <div className="p-3 bg-white mt-4 rounded-lg border-2">
            <p className="flex items-center justify-between gap-1 text-sm font-medium">
              <span className="inline-flex items-center">
                <span>
                  <Bell size={15} />
                </span>
                Reminders
              </span>
              {reminders && reminders.length ? reminders.length : 0} reminder(s)
            </p>
            <div className="flex flex-col mt-2">
              <form onSubmit={(e) => addReminder(e)}>
                <div className="flex gap-2">
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="message">Message</label>
                    <input
                      className="border-2 rounded-lg p-1"
                      type="text"
                      name="message"
                      value={reminder.message}
                      onChange={(e) => {
                        setReminder((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }));
                      }}
                      id="message"
                      placeholder="e.g. Follow up on interview"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      className="border-2 rounded-lg p-1"
                      type="date"
                      name="dueDate"
                      value={reminder.date}
                      onChange={(e) => {
                        setReminder((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }));
                      }}
                      id="dueDate"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`flex items-center text-sm ${reminder.message.trim() && reminder.date ? "bg-blue-700" : "bg-blue-400"} text-white p-1 rounded-lg mt-2`}
                  disabled={
                    reminder.message.trim() && reminder.date ? false : true
                  }
                >
                  <span>
                    <Plus size={15} />
                  </span>
                  Set Reminder
                </button>
              </form>
              {reminders && reminders.length ? (
                reminders.map((reminder, index) => (
                  <div
                    key={index}
                    className="flex gap-2 mt-3 bg-slate-100 p-2 rounded-lg"
                  >
                    <span>
                      <Clock size={20} />
                    </span>
                    <div className="flex justify-between w-full">
                      <div>
                        <p>{reminder.reminderMessage}</p>
                        <p>{reminder.reminderDate}</p>
                      </div>
                      <div onClick={() => deleteReminder(reminder.id)}>
                        <Trash2 size={15} className="hover:text-red-500" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500">No Reminders</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobApplication;
