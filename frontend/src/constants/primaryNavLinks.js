export const primaryNavLinks = [
  { label: "Home", to: "/home", common: true },
  { label: "My Profile", to: "/profile", requiresAuth: true },
  { label: "My Learning", to: "/learning", userTypes: ["student", "career_seeker", "developer"] },
  { label: "Certificates", to: "/certificates", userTypes: ["student", "career_seeker", "developer"] },
  { label: "Saved Resources", to: "/saved-resources", userTypes: ["student", "career_seeker", "developer"], interests: ["books", "online_courses"] },
  { label: "Our Services", to: "/services", userTypes: ["business_owner"], interests: ["software_services", "ecommerce", "mobile_apps"] },
  { label: "Our Portfolio Projects", to: "/projects", userTypes: ["business_owner", "career_seeker", "developer"], interests: ["jobs", "internships", "freelancing"] },
  { label: "Available Courses", to: "/courses", userTypes: ["student", "career_seeker", "developer"], interests: ["online_courses"] },
  { label: "Resource Library", to: "/library", userTypes: ["student", "developer"], interests: ["books", "online_courses", "web_development", "programming", "ai", "ui_ux"] },
  { label: "Creativity Tools", to: "/products", userTypes: ["business_owner"], interests: ["software_services", "ecommerce", "mobile_apps"] },
  { label: "Careers/Opportunities", to: "/careers", userTypes: ["career_seeker"], interests: ["jobs", "internships", "freelancing"] },
  { label: "Growth Insights", to: "/blog", common: true },
  { label: "About KanuorieTech", to: "/about", common: true },
  { label: "Help & Support", to: "/help", common: true },
  { label: "Refer & Earn Program", to: "/affiliate", interests: ["affiliate"] },
  { label: "Accounts & Payments", to: "/payments", common: true },
  { label: "Notifications", to: "/notifications", requiresAuth: true },
  { label: "Settings", to: "/settings", requiresAuth: true },
  { label: "Contact Us", to: "/contact", common: true },
  { label: "Community", to: "/community", userTypes: ["student", "career_seeker", "developer"], interests: ["community"] },
];

const unrestrictedUserTypes = new Set([
  "general",
  "partner",
  "investor",
  "collaborator",
  "investor_collaborator",
]);

export function isPrimaryNavLinkVisible(path, user) {
  const item = primaryNavLinks.find((link) => link.to === path);
  if (!item) return true;
  if (item.requiresAuth && !user) return false;
  if (!user) return true;

  const userType = String(user.userType || "general").trim().toLowerCase();
  if (unrestrictedUserTypes.has(userType) || item.common || item.requiresAuth) {
    return true;
  }

  const interests = new Set(
    (Array.isArray(user.interests) ? user.interests : []).map((interest) =>
      String(interest).trim().toLowerCase()
    )
  );

  return Boolean(
    item.userTypes?.includes(userType) ||
      item.interests?.some((interest) => interests.has(interest))
  );
}
