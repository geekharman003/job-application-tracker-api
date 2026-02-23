import { Application } from "../models/index.js";

export const getSummary = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const applications = await Application.findAll({
      where: { UserId: userId },
      attributes: { exclude: ["updatedAt", "createdAt"] },
      raw: true,
    });

    const totalApplications = applications.length;
    let applied = 0;
    let interviewed = 0;
    let offered = 0;
    let rejected = 0;
    let noResponse = 0;

    applications.forEach((application) => {
      switch (application.status) {
        case "applied":
          applied++;
          break;
        case "interviewed":
          interviewed++;
          break;
        case "offered":
          offered++;
          break;
        case "rejected":
          rejected++;
          break;
        default:
          noResponse++;
          break;
      }
    });

    const responseRate = (
      ((interviewed + offered + rejected) / totalApplications) *
      100
    ).toFixed(2);

    const summary = {
      totalApplications,
      applied,
      interviewed,
      offered,
      rejected,
      noResponse,
      responseRate,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.log("Error in getSummary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
