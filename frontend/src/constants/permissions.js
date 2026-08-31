import { ROLES } from "./roles";

export const PERMISSIONS = {
  [ROLES.USER]: [
    "view_books",
    "view_courses",
    "edit_profile",
    "manage_progress",
  ],

  [ROLES.ADMIN]: [
    "manage_users",
    "manage_books",
    "manage_courses",
    "manage_products",
    "manage_projects",
    "manage_services",
    "manage_team",
    "manage_blog",
    "manage_faq",
    "manage_newsletter",
    "manage_notifications",
    "manage_uploads",
    "view_dashboard",
  ],
};
