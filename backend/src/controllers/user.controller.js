import { User } from "../models/index.js";

export const getProfile = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      raw: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const { id: userId } = req.user;
  const { name, email, bio, linkedInUrl, githubUrl, profilePicUrl } = req.body;

  try {
    if (!name && !email && !bio && !linkedInUrl && !githubUrl && !profilePicUrl)
      return res
        .status(400)
        .json({ message: "At least one field is required" });

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({
      name: name ? name : user.name,
      email: email ? email : user.email,
      bio: bio ? bio : user.bio,
      linkedInUrl: linkedInUrl ? linkedInUrl : user.linkedInUrl,
      githubUrl: githubUrl ? githubUrl : user.githubUrl,
      profilePicUrl: profilePicUrl ? profilePicUrl : user.profilePicUrl,
    });

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    await User.destroy({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "User profile deleted successsfully" });
  } catch (error) {
    console.log("Error in deleteProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadResume = async (req, res) => {};

export const deleteResume = async (req, res) => {};

export const exportDataAsCSV = async (req, res) => {};
