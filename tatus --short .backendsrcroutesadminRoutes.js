warning: in the working copy of 'backend/src/routes/adminRoutes.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/backend/src/routes/adminRoutes.js b/backend/src/routes/adminRoutes.js[m
[1mindex d65afd0..b863127 100644[m
[1m--- a/backend/src/routes/adminRoutes.js[m
[1m+++ b/backend/src/routes/adminRoutes.js[m
[36m@@ -16,6 +16,9 @@[m [mconst {[m
 [m
 const {[m
   getBlogs,[m
[32m+[m[32m  createBlog,[m
[32m+[m[32m  updateBlog,[m
[32m+[m[32m  deleteBlog,[m
 } = require("../controllers/blogController");[m
 [m
 const protect = require("../middleware/auth");[m
[36m@@ -23,26 +26,19 @@[m [mconst adminOnly = require("../middleware/admin");[m
 [m
 const router = express.Router();[m
 [m
[31m-/* ==========================================[m
[31m-   APPLY ADMIN MIDDLEWARE[m
[31m-========================================== */[m
[31m-[m
 router.use(protect);[m
 router.use(adminOnly);[m
 [m
[31m-/* ==========================================[m
[31m-   DASHBOARD[m
[31m-========================================== */[m
[32m+[m[32mrouter.get([m
[32m+[m[32m  "/dashboard",[m
[32m+[m[32m  getStats[m
[32m+[m[32m);[m
 [m
 router.get([m
   "/stats",[m
   getStats[m
 );[m
 [m
[31m-/* ==========================================[m
[31m-   USER MANAGEMENT[m
[31m-========================================== */[m
[31m-[m
 router.get([m
   "/users",[m
   getUsers[m
[36m@@ -63,10 +59,6 @@[m [mrouter.delete([m
   deleteUser[m
 );[m
 [m
[31m-/* ==========================================[m
[31m-   NOTIFICATIONS[m
[31m-========================================== */[m
[31m-[m
 router.get([m
   "/notifications",[m
   getAdminNotifications[m
[36m@@ -82,17 +74,24 @@[m [mrouter.delete([m
   clearAdminNotifications[m
 );[m
 [m
[31m-/* ==========================================[m
[31m-   BLOG MANAGEMENT[m
[31m-========================================== */[m
[31m-[m
 router.get([m
   "/blog",[m
   getBlogs[m
 );[m
 [m
[31m-/* ==========================================[m
[31m-   EXPORT ROUTER[m
[31m-========================================== */[m
[32m+[m[32mrouter.post([m
[32m+[m[32m  "/blog",[m
[32m+[m[32m  createBlog[m
[32m+[m[32m);[m
[32m+[m
[32m+[m[32mrouter.put([m
[32m+[m[32m  "/blog/:id",[m
[32m+[m[32m  updateBlog[m
[32m+[m[32m);[m
[32m+[m
[32m+[m[32mrouter.delete([m
[32m+[m[32m  "/blog/:id",[m
[32m+[m[32m  deleteBlog[m
[32m+[m[32m);[m
 [m
 module.exports = router;[m
\ No newline at end of file[m
