import { ROUTES } from "./routes";

export const MAIN_NAVIGATION = [
  {
    title: "Home",
    path: ROUTES.HOME,
  },
  {
    title: "Dashboard",
    path: ROUTES.PROFILE,
  },
  {
    title: "Library",
    path: ROUTES.LIBRARY,
  },
  {
    title: "Courses",
    path: ROUTES.COURSES,
  },
  {
    title: "Products",
    path: ROUTES.PRODUCTS,
  },
  {
    title: "Projects",
    path: ROUTES.PROJECTS,
  },
  {
    title: "Services",
    path: ROUTES.SERVICES,
  },
  {
    title: "Blog",
    path: ROUTES.BLOG,
  },
  {
    title: "About",
    path: ROUTES.ABOUT,
  },
  {
    title: "Contact",
    path: ROUTES.CONTACT,
  },
];
export const adminNavigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "LayoutDashboard",
  },

  {
    label: "Users",
    path: "/admin/users",
    icon: "Users",
  },

  {
    label: "Academy",
    icon: "GraduationCap",
    children: [
      {
        label: "Courses",
        path: "/admin/courses",
      },
      {
        label: "Lessons",
        path: "/admin/lessons",
      },
    ],
  },

  {
    label: "Library",
    icon: "BookOpen",
    children: [
      {
        label: "Books",
        path: "/admin/books",
      },
    ],
  },

  {
    label: "Content",
    icon: "FileText",
    children: [
      {
        label: "Blog",
        path: "/admin/blog",
      },
      {
        label: "Projects",
        path: "/admin/projects",
      },
      {
        label: "Services",
        path: "/admin/services",
      },
      {
        label: "Team",
        path: "/admin/team",
      },
      {
        label: "Testimonials",
        path: "/admin/testimonials",
      },
      {
        label: "FAQ",
        path: "/admin/faq",
      },
    ],
  },

  {
    label: "Communication",
    icon: "MessageSquare",
    children: [
      {
        label: "Contacts",
        path: "/admin/contacts",
      },
      {
        label: "Newsletter",
        path: "/admin/newsletter",
      },
      {
        label: "Notifications",
        path: "/admin/notifications",
      },
    ],
  },

  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: "BarChart3",
  },

  {
    label: "Settings",
    path: "/admin/settings",
    icon: "Settings",
  },
];