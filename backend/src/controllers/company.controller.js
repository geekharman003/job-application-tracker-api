import { Company } from "../models/index.js";

export const createCompany = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { name, industry, size, contactEmail } = req.body;

    if (!name)
      return res.status(400).json({ message: "Company name is required" });

    const newCompany = await Company.findOrCreate({
      where: {
        name: name.trim().toLowerCase(),
      },
      defaults: {
        UserId: userId,
        industry,
        size,
        contactEmail,
      },
      raw: true,
    });

    if (!newCompany[1])
      return res.status(400).json({ message: "Company already exists" });

    res.status(201).json(newCompany);
  } catch (error) {
    console.log("Error in createCompany:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const companies = await Company.findAll({
      where: {
        UserId: userId,
      },
      raw: true,
      attributes: {
        exclude: ["createdAt","updatedAt"],
      },
    });

    if (!companies.length)
      return res.status(404).json({ message: "No companies found" });

    res.status(200).json(companies);
  } catch (error) {
    console.log("Error in getCompanies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry, size, contactEmail } = req.body;

    const updatedCompany = await Company.update(
      {
        name,
        industry,
        size,
        contactEmail,
      },
      {
        where: {
          id,
        },
      },
    );

    if (!updatedCompany[0])
      return res
        .status(400)
        .json({ message: "Error in updating company details" });

    res.status(200).json({ message: "Company info updated successfully" });
  } catch (error) {
    console.log("Error in updateCompany:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const isCompanyDeleted = await Company.destroy({
      where: {
        id,
      },
    });

    if (!isCompanyDeleted)
      return res
        .status(400)
        .json({ message: "No company exists with this id" });

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCompany:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
