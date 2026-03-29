import { type } from "os";
import { Application, Company, Note, Reminder } from "../models/index.js";
import { sequelize } from "../utils/db.js";
import { QueryTypes } from "sequelize";
import { updateCompany } from "./company.controller.js";

// application
export const createApplication = async (req, res) => {
  const { id: userId } = req.user;
  const {
    company,
    jobTitle,
    location,
    salaryRange,
    jobLink,
    status,
    applicationDate,
    resumeVersion,
    jobDescription,
  } = req.body;

  const t = await sequelize.transaction();
  try {
    if (!company || !jobTitle || !location || !resumeVersion)
      return res.status(400).json({
        message: "company name, jobTitle, location, resumeVersion are required",
      });

    const companyDetails = await Company.findOrCreate({
      where: {
        name: company.trim().toLowerCase(),
      },
      transaction: t,
      raw: true,
    });

    const newApplication = (
      await Application.create(
        {
          UserId: userId,
          CompanyId: companyDetails[0].id,
          jobTitle,
          location,
          salaryRange,
          jobLink,
          status,
          applicationDate,
          resumeVersion,
          jobDescription,
        },
        { transaction: t },
      )
    ).toJSON();

    await t.commit();
    res
      .status(200)
      .json({ ...newApplication, company: companyDetails[0].name });
  } catch (error) {
    await t.rollback();
    console.log("Error in createApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      jobTitle,
      location,
      salaryRange,
      jobLink,
      status,
      applicationDate,
      resumeVersion,
      jobDescription,
    } = req.body;

    const application = await Application.findByPk(id);

    if (!application)
      return res.status(404).json({ message: "No application found" });

    const companyDetails = await Company.findOne({
      where: { name: company.trim().toLowerCase() },
      raw: true,
    });

    if (companyDetails) {
      application.update({ CompanyId: companyDetails.id });
    } else {
      const newCompanyDetails = await Company.create({
        name: company.trim().toLowerCase(),
      });
      await application.update({ CompanyId: newCompanyDetails.id });
    }

    await application.update({
      jobTitle,
      location,
      salaryRange,
      jobLink,
      status,
      applicationDate,
      resumeVersion,
      jobDescription,
    });

    res
      .status(200)
      .json({ message: "Application details updated successfully" });
  } catch (error) {
    console.log("Error in updateApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    await Application.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.log("Error in deleteApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAttachement = async (req, res) => {
  try {
    const { id } = req.params;

    res.status(200).json({ message: "Attachment updated successfully" });
  } catch (error) {
    console.log("Error in updateAttachment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { limit, offset } = req.query;
    limit = Number(limit);
    offset = Number(offset);

    let { title, status, company } = req.query;

    let companyDetails = null;

    // filter query
    let query = "SELECT * FROM applications WHERE UserId = :UserId";
    let totalQuery =
      "SELECT COUNT(*) as totalRecords FROM applications WHERE UserId = :UserId";

    // filters
    if (status && status !== "all") {
      query += " AND status = :status";
      totalQuery += " AND status = :status";
    }

    if (title) {
      query += " AND jobTitle LIKE :jobTitle";
      totalQuery += " AND jobTitle LIKE :jobTitle";
    }

    if (company) {
      companyDetails = await Company.findOne({
        where: { name: company.trim().toLowerCase() },
        attributes: ["id"],
        raw: true,
      });

      if (companyDetails) {
        query += " AND CompanyId = :companyId";
        totalQuery += " AND CompanyId = :companyId";
      }
    }

    query += " LIMIT :LIMIT OFFSET :OFFSET";

    const applications = await sequelize.query(query, {
      replacements: {
        UserId: userId,
        status: status,
        jobTitle: title + "%",
        companyId: companyDetails ? companyDetails.id : 0,
        LIMIT: limit,
        OFFSET: offset,
      },
      type: QueryTypes.SELECT,
    });

    // total records query
    let [totalRecords] = await sequelize.query(totalQuery, {
      replacements: {
        UserId: userId,
        status: status,
        jobTitle: title + "%",
        companyId: companyDetails ? companyDetails.id : 0,
      },
    });

    totalRecords = totalRecords[0]["totalRecords"];

    const pagination = {
      start: offset + 1,
      end: limit + offset > totalRecords ? totalRecords : limit + offset,
      hasNextPage: limit + offset < totalRecords,
      hasPrevPage: offset > 0,
      totalRecords,
    };

    for (const application of applications) {
      const companyDetails = await Company.findByPk(application.CompanyId, {
        attributes: ["name"],
        raw: true,
      });

      application.company = companyDetails.name;
    }

    // // if (!applications.length)
    // //   return res.status(404).json({ message: "No Application found" });

    res.status(200).json({ applications, pagination });
  } catch (error) {
    console.log("Error in getApplications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const company = await Company.findByPk(application.CompanyId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    const notes = await Note.findAll({
      where: { ApplicationId: application.id },
      raw: true,
    });

    const reminders = await Reminder.findAll({
      where: { ApplicationId: application.id },
      raw: true,
    });

    const applicationDetails = {
      ...application,
      ...company,
      notes: [...notes],
      reminders: [...reminders],
    };

    res.status(200).json(applicationDetails);
  } catch (error) {
    console.log("Error in getApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// notes
export const createNote = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { note } = req.body;

    if (!note) return res.status(400).json({ message: "note is required" });

    const newNote = await Note.create(
      {
        ApplicationId: applicationId,
        note: note.trim(),
      },
      {
        raw: true,
      },
    );

    res.status(201).json(newNote);
  } catch (error) {
    console.log("Error in createNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const notes = await Note.findAll({
      where: {
        ApplicationId: applicationId,
      },
      raw: true,
    });

    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in getNotes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { note } = req.body;

    if (!note) return res.status(400).json({ message: "note is required" });

    const noteDetails = await Note.findByPk(noteId);
    const updatedNoteDetails = await noteDetails.update({
      note,
    });

    res.status(200).json(updatedNoteDetails);
  } catch (error) {
    console.log("Error in updateNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByPk(noteId);
    await note.destroy();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// reminders
export const createReminder = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { date, message } = req.body;

    if (!date || !message)
      return res
        .status(400)
        .json({ message: "reminder date & message are required" });

    const reminder = await Reminder.create(
      {
        ApplicationId: applicationId,
        reminderDate: date,
        reminderMessage: message,
      },
      { raw: true },
    );

    res.status(201).json(reminder);
  } catch (error) {
    console.log("Error in deleteNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getReminders = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const reminders = await Reminder.findAll({
      where: {
        ApplicationId: applicationId,
      },
      attributes: { exclude: ["updatedAt"] },
      raw: true,
    });

    res.status(200).json(reminders);
  } catch (error) {
    console.log("Error in getReminder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;

    const { date, message } = req.body;

    const reminder = await Reminder.findByPk(reminderId);

    const updatedReminderDetails = await reminder.update({
      reminderDate: date,
      reminderMessage: message,
    });

    res.status(200).json(updatedReminderDetails);
  } catch (error) {
    console.log("Error in updateReminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;

    const reminder = await Reminder.findByPk(reminderId);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await reminder.destroy();

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.log("Error in deleteReminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
