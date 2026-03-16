import User from "./user.model.js";
import Application from "./application.model.js";
import Company from "./company.model.js";
import Reminder from "./reminder.model.js";
import Note from "./notes.model.js";
import Resume from "./resume.model.js";

// User
User.hasMany(Application, { onDelete: "CASCADE" });
Application.belongsTo(User);

// Application -> Reminder
Application.hasOne(Reminder, { onDelete: "CASCADE" });
Reminder.belongsTo(Application);

// Application -> Note
Application.hasMany(Note, { onDelete: "CASCADE" });
Note.belongsTo(Application);

// User -> Resume
User.hasMany(Resume, { onDelete: "CASCADE" });
Resume.belongsTo(User);

export { User, Application, Company, Reminder, Note, Resume };
