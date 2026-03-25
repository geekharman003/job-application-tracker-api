import { Save, FileText, User, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { axiosClient } from "../axios/axiosClient";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import defaultProfile from "../assets/images/default-profile-img.jpg";
import axios from "axios";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [profileUrl, setProfileUrl] = useState(null);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [isUpdatingProfilePic, setIsUpdatingProfilePic] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get("/users/profile");
        const { name, email, bio, linkedInUrl, githubUrl, signedUrl, resumes } =
          response.data;
        setName(name);
        setEmail(email);
        setBio(bio ? bio : "");
        setLinkedIn(linkedInUrl ? linkedInUrl : "");
        setGithub(githubUrl ? githubUrl : "");
        setProfileUrl(signedUrl ? signedUrl : "");
        setResumes(resumes ? resumes : []);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const updateProfileDetails = async () => {
    setIsUpdatingDetails(true);
    try {
      await axiosClient.put("/users/profile", {
        name,
        email,
        bio,
        linkedInUrl: linkedIn,
        githubUrl: github,
      });

      toast.success("Details updated successfully");
    } catch (error) {
      console.log("Error in updateProfileDetails:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  const updateProfilePic = async () => {
    if (!selectedProfilePic) return;

    // constructing the form data object for image file
    const formData = new FormData();
    formData.append("profileImage", selectedProfilePic);

    try {
      const response = await axiosClient.post(
        "/users/profile-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setProfileUrl(response?.data?.url);

      toast.success("Profile Pic updated successfully");
    } catch (error) {
      console.log("Error in updateProfilePic:", error);
      toast.error("Something went wrong!");
    }
  };

  const uploadResume = async () => {
    if (!selectedResume) return;

    const formData = new FormData();
    formData.append("resume", selectedResume);

    try {
      const response = await axiosClient.post(
        "/users/profile/resumes",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setResumes((prev) => [...prev, response.data]);
      setSelectedResume(null);

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.log("Error in uploadResume:", error);
      toast.error("Something went wrong!");
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      await axiosClient.delete(`/users/profile/resumes/${resumeId}`);

      const response = await axiosClient.get("/users/profile/resumes");

      setResumes(response.data);

      toast.success("Resume deleted successfully");
    } catch (error) {
      console.log("Error in deleteResume:", error);
      toast.error("Unable to delete the resume");
    }
  };

  return (
    <>
      <Header />
      {isDeletingProfile ? (
        <DeleteModal setIsDeletingProfile={setIsDeletingProfile} />
      ) : (
        ""
      )}
      <div className="bg-gray-100 p-4">
        <div className="max-w-4xl m-auto">
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-slate-500">
            Manage your personal information and preferences
          </p>
          {/* profile section */}
          <div className="bg-white rounded-xl">
            <div className="flex gap-2 rounded-lg px-3 py-4 mt-5">
              <div className="flex justify-center items-center rounded-full text-white bg-blue-700">
                <img
                  className="w-full h-full text-center object-cover rounded-full"
                  src={profileUrl}
                  alt="profile image"
                  onError={(e) => {
                    e.target.src = defaultProfile;
                    e.onerror = null;
                  }}
                />
              </div>
              <div>
                <p className="font-bold">{name}</p>
                <p className="text-sm text-slate-500">{email}</p>
                <div>
                  <input
                    onChange={(e) => setSelectedProfilePic(e?.target?.files[0])}
                    type="file"
                    accept="image/*"
                    className="mt-2"
                  />
                </div>
                {selectedProfilePic ? (
                  <button
                    onClick={() => updateProfilePic()}
                    className="ml-1 mt-1 bg-blue-700 text-white p-1 rounded-lg"
                  >
                    Change Pic
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex justify-between gap-2 p-4">
              <div className="w-6/12">
                <label htmlFor="name" className="font-medium">
                  Full Name
                </label>
                <br />
                <input
                  id="name"
                  className="border-2 rounded-lg px-2 py-1 w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  type="text"
                />
              </div>
              <div className="w-6/12">
                <label htmlFor="email" className="font-medium">
                  Email
                </label>
                <br />
                <input
                  id="email"
                  className="border-2 rounded-lg px-2 py-1 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                />
              </div>
            </div>
            <div className="p-4">
              <label htmlFor="bio" className="font-medium">
                Bio
              </label>
              <br />
              <textarea
                rows={5}
                className="w-full border-2 rounded-lg px-2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                name="bio"
                id="bio"
              ></textarea>
            </div>
            <div className="flex justify-between gap-2 p-4">
              <div className="w-6/12">
                <label htmlFor="linkedIn" className="font-medium">
                  Linkedin
                </label>
                <br />
                <input
                  id="linkedIn"
                  className="border-2 rounded-lg px-2 py-1 w-full"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  name="linkedIn"
                  type="url"
                />
              </div>
              <div className="w-6/12">
                <label htmlFor="github" className="font-medium">
                  Github
                </label>
                <br />
                <input
                  id="github"
                  className="border-2 rounded-lg px-2 py-1 w-full"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  name="github"
                  type="url"
                />
              </div>
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={updateProfileDetails}
                className="flex gap-1 bg-blue-700 text-white p-2 rounded-xl"
                disabled={isUpdatingDetails ? true : false}
              >
                <span>
                  {isUpdatingDetails ? <Loader /> : <Save size={20} />}
                </span>{" "}
                Save Changes
              </button>
            </div>
          </div>
          {/* resume section */}
          <div className="mt-5 bg-white rounded-xl p-4">
            <div className="flex justify-between items-end gap-1">
              <div>
                <div className="flex items-center gap-1">
                  <span>
                    <FileText size={15} />
                  </span>
                  <span className="text-sm font-medium">Resume Versions</span>
                </div>
                <p className="text-xs text-slate-500">
                  Track which resume version you used for each application
                </p>
              </div>
              <div>
                <input
                  onChange={(e) => setSelectedResume(e?.target?.files[0])}
                  type="file"
                  accept="application/pdf"
                  name="resume"
                  id="resume"
                />
                {selectedResume ? (
                  <button
                    onClick={() => uploadResume()}
                    className="bg-blue-700 text-white p-1 px-2 rounded-xl mt-1"
                  >
                    Upload
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            {resumes && resumes.length ? (
              resumes.map((resume, index) => (
                <div
                  key={index}
                  className="flex justify-between border-2 p-2 mt-3 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-fit bg-slate-200 p-2 rounded-xl">
                      <FileText size={20} />
                    </span>
                    <span className="text-sm">{resume.version}</span>
                  </div>
                  <div className="flex items-center">
                    <a
                      className="hover:bg-slate-200 rounded-xl py-1 px-3"
                      href={resume.signedUrl}
                      target="_blank"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="bg-red-600 text-white rounded-xl p-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="border-2 p-2 mt-3 rounded-xl"
              >
               <p className="text-center">No resumes Added</p>
              </div>
            )}
          </div>
          {/* account section */}
          <div className="mt-5 bg-white rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span>
                <User size={15} />
              </span>
              <span className="text-sm font-medium">Account Settings</span>
            </div>
            <div className="flex items-center justify-between mt-3 py-2 border-b-2">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-slate-500">
                  Download all your application data as CSV
                </p>
              </div>
              <div>
                <button className="text-sm border border-slate-300 rounded-xl p-2 hover:bg-slate-100">
                  Export CSV
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="mt-2">
                <p className="text-base text-red-400 font-semibold">
                  Delete Account
                </p>
                <p className="text-sm text-slate-500">
                  Permanently delete all your data
                </p>
              </div>
              <div>
                <button
                  onClick={() => setIsDeletingProfile(true)}
                  className="rounded-xl py-2 px-3 bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
