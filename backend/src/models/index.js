import User from "./user.model.js";
import Application from "./application.model.js";
import Attachment from "./attachment.model.js";
import Company from "./company.model.js";
import JobListing from "./jobListings.model.js";
import Reminder from "./remainder.model.js";

// User
User.hasMany(Application);
Application.belongsTo(User);

// Company
Company.hasMany(Application);
Application.belongsTo(Company);

// Application -> Reminder
Application.hasOne(Reminder);
Reminder.belongsTo(Application);

// Application -> Attachment
Application.hasMany(Attachment);
Attachment.belongsTo(Application);

// User -> Company
User.hasMany(Company);
Company.belongsTo(User);

export { User, Application, Attachment, Company, JobListing, Reminder };
