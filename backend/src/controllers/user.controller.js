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
  const { name, email } = req.body;

  try {
    if (!name && !email)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({
      name: name ? name : user.name,
      email: email ? email : user.email,
    });

    res.status(200).json({ message: "User updated succeddfully" });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
