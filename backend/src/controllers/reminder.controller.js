import { Reminder } from "../models/index.js";

export const createReminder = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reminderDate } = req.body;

    await Reminder.create({
      ApplicationId: applicationId,
      reminderDate: reminderDate,
    });

    res.status(201).json({ message: "Reminder created successfully" });
  } catch (error) {
    console.log("Error in createReminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;

    const reminder = await Reminder.findByPk(reminderId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });
    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });

    res.status(200).json(reminder);
  } catch (error) {
    console.log("Error in getReminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;

    await Reminder.destroy({
      where: {
        id: reminderId,
      },
    });

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.log("Error in deleteReminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
