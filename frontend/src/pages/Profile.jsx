import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Camera,
  CheckCircle2,
  Mail,
  User,
  AtSign,
  FileText,
  ShieldCheck,
  Save,
} from "lucide-react";

import { Card, Button } from "../components/common";
import { Input } from "../components/ui";

import { useAuth } from "../contexts/AuthContext";
import {
  updateProfile,
  uploadAvatar,
} from "../services";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Sync form with authenticated user
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
    });
  }, [user]);

  /*
  |--------------------------------------------------------------------------
  | Form change
  |--------------------------------------------------------------------------
  */

  const change = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save profile
  |--------------------------------------------------------------------------
  */

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!form.firstName.trim()) {
      toast.error("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      toast.error("Last name is required.");
      return;
    }

    if (!form.username.trim()) {
      toast.error("Username is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email address is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await updateProfile(form);

      const updatedUser =
        res?.data?.user ||
        res?.data ||
        res?.user ||
        null;

      if (updatedUser) {
        setUser(updatedUser);
      } else {
        setUser({
          ...user,
          ...form,
        });
      }

      toast.success(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Avatar upload
  |--------------------------------------------------------------------------
  */

  const changeAvatar = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    /*
     * Basic client-side validation
     */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a JPG, PNG, or WebP image."
      );

      event.target.value = "";
      return;
    }

    /*
     * Keep uploads reasonably sized.
     * Backend should still validate this.
     */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Profile image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setAvatarLoading(true);

      const formData = new FormData();

      formData.append("avatar", file);

      const res =
        await uploadAvatar(formData);

      const avatar =
        res?.data?.avatar ||
        res?.avatar ||
        res?.data?.user?.avatar;

      if (!avatar) {
        throw new Error(
          "Avatar URL was not returned by the server."
        );
      }

      setUser({
        ...user,
        avatar,
      });

      toast.success(
        "Profile photo updated successfully."
      );
    } catch (err) {
      console.error(
        "Avatar upload error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to upload profile photo."
      );
    } finally {
      setAvatarLoading(false);

      /*
       * Allow selecting the same image again.
       */

      event.target.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading / unauthenticated state
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
        <Card className="w-full max-w-lg p-10 text-center">
          <ShieldCheck
            size={48}
            className="mx-auto mb-5 text-blue-600"
          />

          <h1 className="text-2xl font-bold text-slate-900">
            Profile unavailable
          </h1>

          <p className="mt-3 text-slate-600">
            Please sign in to view and manage
            your profile.
          </p>
        </Card>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Display values
  |--------------------------------------------------------------------------
  */

  const fullName =
    `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim() || "User";

  const initials =
    `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`.toUpperCase() || "U";

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12 lg:py-20">

      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-10">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Account
          </p>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Manage your personal information and
            profile photo from one place.
          </p>

        </div>

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}

        <Card className="mb-8 overflow-hidden p-0">

          <div className="h-32 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700" />

          <div className="px-6 pb-8 md:px-10">

            <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">

                {/* Avatar */}

                <div className="relative">

                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={fullName}
                      className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-4xl font-black text-white shadow-xl">
                      {initials}
                    </div>
                  )}

                  {/* Camera button */}

                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-1 right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 ${
                      avatarLoading
                        ? "pointer-events-none opacity-60"
                        : ""
                    }`}
                    title="Change profile photo"
                  >
                    {avatarLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Camera size={19} />
                    )}
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={changeAvatar}
                    className="hidden"
                    disabled={avatarLoading}
                  />

                </div>

                {/* User information */}

                <div className="pb-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                      {fullName}
                    </h2>

                    {user.role && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold capitalize text-blue-700">
                        {user.role}
                      </span>
                    )}

                  </div>

                  <p className="mt-2 text-slate-500">
                    @{user.username}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">

                <CheckCircle2 size={18} />

                Account Active

              </div>

            </div>

          </div>

        </Card>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* ===================================================
              PROFILE FORM
          ==================================================== */}

          <Card className="p-6 md:p-8">

            <div className="mb-8 flex items-start justify-between gap-4">

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Update the information associated
                  with your account.
                </p>

              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:flex">

                <User size={22} />

              </div>

            </div>

            <form
              onSubmit={saveProfile}
              className="space-y-6"
            >

              <div className="grid gap-6 md:grid-cols-2">

                <Input
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={change}
                  placeholder="Enter your first name"
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={change}
                  placeholder="Enter your last name"
                />

                <Input
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={change}
                  placeholder="Enter your username"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                  placeholder="Enter your email"
                />

              </div>

              {/* Bio */}

              <div>

                <label
                  htmlFor="bio"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <FileText size={16} />

                  Bio
                </label>

                <textarea
                  id="bio"
                  rows={6}
                  name="bio"
                  value={form.bio}
                  onChange={change}
                  maxLength={500}
                  placeholder="Tell us a little about yourself..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-2 flex justify-end">

                  <span className="text-xs text-slate-400">
                    {form.bio.length}/500
                  </span>

                </div>

              </div>

              {/* Save */}

              <div className="flex justify-end border-t border-slate-100 pt-6">

                <Button
                  type="submit"
                  loading={loading}
                  disabled={avatarLoading}
                >
                  <Save
                    size={18}
                    className="mr-2"
                  />

                  Save Changes
                </Button>

              </div>

            </form>

          </Card>

          {/* ===================================================
              ACCOUNT SUMMARY
          ==================================================== */}

          <div className="space-y-6">

            <Card className="p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ShieldCheck size={22} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Account Information
                  </h3>

                  <p className="text-xs text-slate-500">
                    Your account details
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                <InfoRow
                  icon={<User size={17} />}
                  label="Name"
                  value={fullName}
                />

                <InfoRow
                  icon={<AtSign size={17} />}
                  label="Username"
                  value={
                    user.username
                      ? `@${user.username}`
                      : "Not set"
                  }
                />

                <InfoRow
                  icon={<Mail size={17} />}
                  label="Email"
                  value={
                    user.email ||
                    "Not available"
                  }
                />

                <InfoRow
                  icon={
                    <ShieldCheck
                      size={17}
                    />
                  }
                  label="Role"
                  value={
                    user.role || "User"
                  }
                />

              </div>

            </Card>

            {/* Profile photo information */}

            <Card className="p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Camera size={19} />
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Profile Photo
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Use a clear JPG, PNG, or WebP
                    image. Maximum file size is 5MB.
                  </p>

                  <label
                    htmlFor="avatar-upload"
                    className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <Camera
                      size={16}
                      className="mr-2"
                    />

                    Change Photo
                  </label>

                </div>

              </div>

            </Card>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =============================================================
   INFO ROW
============================================================= */

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}
