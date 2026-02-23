import { Application, Attachment, Company } from "../models/index.js";
import { Op } from "sequelize";
import { sequelize } from "../utils/db.js";

export const createApplication = async (req, res) => {
  const { id: userId } = req.user;
  const {
    name,
    industry,
    size,
    contactEmail,
    jobTitle,
    applicationDate,
    status,
    notes,
  } = req.body;

  const t = await sequelize.transaction();
  try {
    if (!name || !jobTitle)
      return res
        .status(400)
        .json({ message: "company name and job title are required" });

    const company = await Company.findOrCreate({
      raw: true,

      where: {
        name: name.trim().toLowerCase(),
      },
      defaults: {
        UserId: userId,
        industry,
        size,
        contactEmail,
      },
      transaction: t,
    });

    const newApplication = await Application.create(
      {
        UserId: userId,
        CompanyId: company[0].id,
        jobTitle,
        applicationDate,
        status,
        notes,
      },
      { raw: true, transaction: t },
    );

    const attachment = await Attachment.create(
      {
        ApplicationId: newApplication.id,
        fileUrl: req.file.path,
      },
      { raw: true, transaction: t },
    );

    await t.commit();
    res.status(200).json({ message: "Application created successfully" });
  } catch (error) {
    await t.rollback();
    console.log("Error in createApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobTitle, applicationDate, status, notes } = req.body;

    const application = await Application.findByPk(id, { raw: true });

    if (!application)
      return res.status(404).json({ message: "No application found" });

    await application.update({
      jobTitle: jobTitle ? jobTitle : application.jobTitle,
      applicationDate: applicationDate
        ? applicationDate
        : application.applicationDate,
      status: status ? status : application.status,
      notes: notes ? notes : application.notes,
    });

    res
      .status(200)
      .json({ message: "Application details updated successfully" });
  } catch (error) {
    console.log("Error in updateApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAttachement = async (req, res) => {
  try {
    const { id } = req.params;

    await Attachment.update(
      {
        fileUrl: req.file.path,
      },
      {
        where: {
          ApplicationId: id,
        },
      },
    );

    res.status(200).json({ message: "Attachment updated successfully" });
  } catch (error) {
    console.log("Error in updateAttachment:", error);
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

export const getApplications = async (req, res) => {
  try {
    let { status, startDate, endDate } = req.query;

    const whereConditions = {};

    if (status) {
      whereConditions.status = status;
    }

    if (startDate && endDate) {
      whereConditions.applicationDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereConditions.applicationDate = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereConditions.applicationDate = {
        [Op.lte]: endDate,
      };
    }

    const applications = await Application.findAll({
      where: whereConditions,
      raw: true,
    });

    if (!applications.length)
      return res.status(404).json({ message: "No Application Found" });

    res.status(200).json(applications);
  } catch (error) {
    console.log("Error in getApplications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id, { raw: true });

    if (!application)
      return res.status(404).json({ message: "No Application Found" });

    res.status(200).json(application);
  } catch (error) {
    console.log("Error in getApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
