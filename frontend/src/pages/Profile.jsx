import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts";
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  X,
  Save,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Profile() {
  const { user, updateProfile, uploadAvatar, loading: authLoading } = useAuth();

  const fileInputRef = useRef(null);

  /* ==========================================
     MODAL STATE
  ========================================== */

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* ==========================================
     FORM STATE
  ========================================== */

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  /* ==========================================
     UI STATE
  ========================================== */

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  /* ==========================================
     LOAD USER INTO FORM
  ========================================== */

  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
    });
  }, [user]);

  /* ==========================================
     CLEANUP IMAGE PREVIEW
  ========================================== */

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* ==========================================
     OPEN MODAL
  ========================================== */

  const openEditModal = () => {
    setErrorMessage("");
    setSuccessMessage("");

    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    });

    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    setIsEditModalOpen(true);
  };

  /* ==========================================
     CLOSE MODAL
  ========================================== */

  const closeEditModal = () => {
    if (saving || uploadingAvatar) return;

    setIsEditModalOpen(false);
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================
     AVATAR FILE SELECTION
  ========================================== */

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setErrorMessage("");
    setSuccessMessage("");

    /* Validate file type */

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");

      event.target.value = "";
      return;
    }

    /* Validate file size */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage("Image must be smaller than 5MB.");

      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(url);
  };

  /* ==========================================
     UPLOAD AVATAR
  ========================================== */

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setUploadingAvatar(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      formData.append("avatar", selectedFile);

      const response = await uploadAvatar(formData);

      const uploadedAvatar =
        response?.data?.avatar ||
        response?.avatar ||
        response?.data?.user?.avatar;

      if (!uploadedAvatar) {
        throw new Error("Avatar uploaded but no image URL was returned.");
      }

      /*
       * Update the profile avatar immediately.
       *
       * This also keeps AuthContext and localStorage
       * synchronized.
       */

      await updateProfile({
        avatar: uploadedAvatar,
      });

      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }

      setSuccessMessage("Profile photo updated successfully.");
    } catch (error) {
      console.error("Avatar upload error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload profile photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* ==========================================
     SAVE PROFILE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
      };

      if (!payload.firstName) {
        throw new Error("First name is required.");
      }

      if (!payload.lastName) {
        throw new Error("Last name is required.");
      }

      if (!payload.email) {
        throw new Error("Email address is required.");
      }

      await updateProfile(payload);

      setSuccessMessage("Profile updated successfully.");

      /*
       * Give the user a moment to see the success
       * message before closing the modal.
       */

      setTimeout(() => {
        setIsEditModalOpen(false);
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     AVATAR DISPLAY
  ========================================== */

  const displayAvatar = previewUrl || user?.avatar || "";

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "U";

  /* ==========================================
     NO USER
  ========================================== */

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />

          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Account
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your personal information and account details.
              </p>
            </div>

            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* COVER */}

          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:h-40" />

          {/* PROFILE CONTENT */}

          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
              {/* AVATAR */}

              <div className="flex items-end gap-4">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 text-3xl font-bold text-gray-600 shadow-md dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300 sm:h-36 sm:w-36">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h2>

                    {user.role === "admin" && (
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                    )}
                  </div>

                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {user.role === "admin"
                      ? "Administrator"
                      : "KanuorieTech User"}
                  </p>
                </div>
              </div>
            </div>

            {/* INFORMATION */}

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {/* EMAIL */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email Address
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* PHONE */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone Number
                    </p>

                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ROLE */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Account Role
                    </p>

                    <p className="mt-1 font-semibold capitalize text-gray-900 dark:text-white">
                      {user.role || "user"}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Account Status
                    </p>

                    <p className="mt-1 font-semibold text-emerald-600">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BIO */}

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                About Me
              </p>

              <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700 dark:text-gray-300">
                {user.bio || "You haven't added a bio yet."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          EDIT PROFILE MODAL
      ======================================== */}

      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-gray-900">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your personal information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving || uploadingAvatar}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              {/* ALERTS */}

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                  <p>{successMessage}</p>
                </div>
              )}

              {/* =================================
                  AVATAR
              ================================= */}

              <div className="mb-7 flex flex-col items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100 text-2xl font-bold text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar || saving}
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50 dark:border-gray-900"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <p className="mt-3 text-center text-xs text-gray-500">
                  JPG, PNG or WEBP. Maximum 5MB.
                </p>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        Upload Photo
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* =================================
                  FORM
              ================================= */}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* BIO */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Bio
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.bio.length}/500
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    maxLength={500}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={saving || uploadingAvatar}
                    className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploadingAvatar || authLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
