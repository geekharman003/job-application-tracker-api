import sharp from "sharp";
import { Resume, User } from "../models/index.js";
import s3 from "../config/aws_s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "../config/env.js";
import {
  putObjectCommand,
  getObjectCommand,
  deleteObjectCommand,
} from "../utils/aws_s3.js";

export const getProfile = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      raw: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    let signedUrl = null;

    if(user.profilePicUrl){
      const getCommand = getObjectCommand(ENV.BUCKET_NAME, user.profilePicUrl);
      signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 60 });
    }


    const resumes = await Resume.findAll({
      where: {
        UserId: userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    // getting all resumes
    const bucket = ENV.BUCKET_NAME;

    for (const resume of resumes) {
      const getCommand = getObjectCommand(bucket, resume.url);
      const signedUrl = await getSignedUrl(s3, getCommand);
      resume.signedUrl = signedUrl;
    }

    res.status(200).json({ ...user, signedUrl, resumes: [...resumes] });
  } catch (error) {
    console.log("Error in getProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const { id: userId } = req.user;
  const { name, email, bio, linkedInUrl, githubUrl } = req.body;

  try {
    if (!name && !email && !bio && !linkedInUrl && !githubUrl)
      return res
        .status(400)
        .json({ message: "At least one field is required" });

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({
      name,
      email,
      bio,
      linkedInUrl,
      githubUrl,
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

export const updateProfilePic = async (req, res) => {
  const { id: userId } = req.user;
  const extension = req.file.originalname.split(".")[1];

  try {
    // resizing the image to a common size
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 80, width: 80, fit: "contain" })
      .toBuffer();

    const imageKey = `uploads/profile-img/${Date.now()}.${extension}`;

    const putCommand = putObjectCommand(
      ENV.BUCKET_NAME,
      imageKey,
      buffer,
      req.file.mimetype,
    );
    await s3.send(putCommand);

    const user = await User.findByPk(userId);

    await user.update({ profilePicUrl: imageKey });

    const getCommand = getObjectCommand(ENV.BUCKET_NAME, imageKey);
    const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 100 });

    res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getResumes = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const resumes = await Resume.findAll({
      where: {
        UserId: userId,
      },
      raw: true,
    });

    // getting all resumes
    const bucket = ENV.BUCKET_NAME;

    for (const resume of resumes) {
      const getCommand = getObjectCommand(bucket, resume.url);
      const signedUrl = await getSignedUrl(s3, getCommand);
      resume.signedUrl = signedUrl;
    }

    res.status(200).json(resumes);
  } catch (error) {
    console.log("Error in getResumes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const resume = await Resume.findOne({
      where: { version: req.file?.originalname?.split(".")[0] },
    });

    if (resume)
      return res
        .status(400)
        .json({ message: "Please upload a different resume" });

    const bucketName = ENV.BUCKET_NAME;
    const pdfKey = `uploads/resumes/${Date.now()}.pdf`;
    const body = req.file.buffer;
    const contentType = req.file.mimetype;

    const putCommand = putObjectCommand(bucketName, pdfKey, body, contentType);
    await s3.send(putCommand);

    // getting the signed url
    const getCommand = getObjectCommand(bucketName, pdfKey);
    const signedUrl = await getSignedUrl(s3, getCommand);

    // saving the resume version & key in db
    //  to fetch the signed url later
    const resumeDetails = (
      await Resume.create(
        {
          UserId: userId,
          url: pdfKey,
          version: req.file?.originalname?.split(".")[0],
        },
        { raw: true },
      )
    ).toJSON();

    res.status(201).json({ ...resumeDetails, signedUrl });
  } catch (error) {
    console.log("Error in uploadResume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findByPk(id);

    if (!resume) return res.status(404).json({ message: "No resume found" });

    const bucket = ENV.BUCKET_NAME;
    const key = resume.url;

    const deleteCommand = deleteObjectCommand(bucket, key);

    await s3.send(deleteCommand);

    await resume.destroy();

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.log("Error in deleteResume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const exportDataAsCSV = async (req, res) => {};
