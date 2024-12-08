import { destr } from "destr";
import { boolean, mixed, object, string } from "yup";

// Schema to validate ID parameter
export const IdParamSchema = object({
  id: string().required().label("ID"),
});

// Schema to validate strong passwords
const StrongPasswordSchema = string()
  .min(8)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
  );

// Schema to validate login credentials
export const LoginSchema = object({
  email: string().email().required(),
  password: StrongPasswordSchema.required().label("Password"),
  remember: boolean().label("Remember me").default(false),
});

// Schema to validate registration details
export const RegisterSchema = LoginSchema.shape({
  name: string().required().label("Name").min(3).max(50),
});

// Schema to validate project creation details
export const CreateProjectSchema = object({
  name: string().required().label("Project name").min(3).max(50),
  description: string()
    .label("Description")
    .max(255)
    .transform((value) => value || undefined),
});

// Schema to validate template creation details
export const CreateTemplateSchema = object({
  name: string().required().label("Template name").min(3).max(50),
  html: string().label("HTML"),
  design: object().label("Design"),
  projectId: string().label("Project ID"),
});

export const SendTestEmailSchema = object({
  email: string().email().required().label("Email"),
  subject: string().required().label("Subject"),
  data: mixed()
    .label("Data")
    .transform((value) => destr(value || {})),
});

export const UpdateAccountSchema = object({
  name: string().required().label("Name").min(3).max(50),
  email: string().email().required().label("Email"),
});

export const UpdatePasswordSchema = object({
  currentPassword: StrongPasswordSchema.required().label("Current password"),
  newPassword: StrongPasswordSchema.required().label("New password"),
  revokeOtherSessions: boolean().label("Revoke other sessions").default(false),
});
