import { useEffect } from "react";
import { Trash } from "lucide-react";
import { axiosClient } from "../../axios/axiosClient";
import toast from "react-hot-toast";
import useAuth from "../../store/useAuthStore";

function ProfileDeleteModal({ setIsDeletingProfile }) {
  const { setAuthUser } = useAuth();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = "auto");
  }, []);

  const deleteUserProfile = async () => {
    try {
      await axiosClient.delete("/users/profile");
      setAuthUser(null);
      toast.success("Profile Delete successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeletingProfile(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      className="flex fixed top-0 left-0 z-20 justify-center items-center bg-slate-800/50 w-screen h-screen"
    >
      <div
        id="modal"
        className="p-3 max-w-96 bg-white opacity-100 z-40 rounded-xl"
      >
        <p>Do you want to premenantely delete your account?</p>
        <div className="flex justify-end gap-2 p-3">
          <button
            onClick={() => setIsDeletingProfile(false)}
            className="bg-slate-100 rounded-xl p-2"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteUserProfile()}
            className="flex items-center bg-red-600 text-white rounded-xl p-2"
          >
            <span>
              <Trash size={15} />
            </span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileDeleteModal;
