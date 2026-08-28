import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Card,
  Button,
} from "../components/common";

import {
  getCurrentUser,
} from "../api/authApi";
import {
  updateSettings,
  changePassword,
} from "../api/userApi";

import { useTheme } from "../contexts";

const DEFAULT_SETTINGS = {
  theme: "system",
  language: "en",

  notifications: {
    courses: true,
    resources: true,
    products: true,
    account: true,
    promotions: false,
  },

  emailPreferences: {
    security: true,
    courses: true,
    resources: true,
    products: true,
    newsletter: true,
    promotions: false,
  },
};

export default function Settings() {
  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [passwords, setPasswords] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showPasswords, setShowPasswords] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [changingPassword, setChangingPassword] =
    useState(false);

  /* ==========================================
     LOAD SETTINGS
  ========================================== */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response =
          await getCurrentUser();

        const user =
          response?.data || response;

        if (user?.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...user.settings,

            notifications: {
              ...DEFAULT_SETTINGS.notifications,
              ...user.settings.notifications,
            },

            emailPreferences: {
              ...DEFAULT_SETTINGS.emailPreferences,
              ...user.settings
                .emailPreferences,
            },
          });
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );

        toast.error(
          "Unable to load your settings."
        );
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  /* ==========================================
     SAVE SETTINGS
  ========================================== */

  const saveSettings = async (
    updatedSettings
  ) => {
    try {
      setSavingSettings(true);

      const response =
        await updateSettings(
          updatedSettings
        );

      const savedUser =
        response?.data || response;

      if (savedUser?.settings) {
        setSettings((prev) => ({
          ...prev,
          ...savedUser.settings,

          notifications: {
            ...prev.notifications,
            ...savedUser.settings
              .notifications,
          },

          emailPreferences: {
            ...prev.emailPreferences,
            ...savedUser.settings
              .emailPreferences,
          },
        }));
      }

      toast.success(
        "Settings updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to save settings."
      );
    } finally {
      setSavingSettings(false);
    }
  };

  /* ==========================================
     UPDATE NOTIFICATION SETTING
  ========================================== */

  const toggleNotification = (
    key
  ) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]:
          !settings.notifications[key],
      },
    };

    setSettings(updated);
    saveSettings(updated);
  };

  /* ==========================================
     UPDATE EMAIL SETTING
  ========================================== */

  const toggleEmailPreference = (
    key
  ) => {
    // Security emails should always remain enabled.
    if (key === "security") {
      return;
    }

    const updated = {
      ...settings,
      emailPreferences: {
        ...settings.emailPreferences,
        [key]:
          !settings.emailPreferences[key],
      },
    };

    setSettings(updated);
    saveSettings(updated);
  };

  /* ==========================================
     DARK MODE
  ========================================== */

  const handleThemeToggle = async () => {
    toggleTheme();

    const newTheme =
      darkMode ? "light" : "dark";

    const updated = {
      ...settings,
      theme: newTheme,
    };

    setSettings(updated);

    await saveSettings(updated);
  };

  /* ==========================================
     PASSWORD INPUT
  ========================================== */

  const handlePasswordChange = ({
    target,
  }) => {
    setPasswords((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  /* ==========================================
     CHANGE PASSWORD
  ========================================== */

  const handleChangePassword =
    async (event) => {
      event.preventDefault();

      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = passwords;

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        toast.error(
          "Please complete all password fields."
        );
        return;
      }

      if (newPassword.length < 6) {
        toast.error(
          "New password must be at least 6 characters."
        );
        return;
      }

      if (
        newPassword !== confirmPassword
      ) {
        toast.error(
          "New passwords do not match."
        );
        return;
      }

      if (
        currentPassword === newPassword
      ) {
        toast.error(
          "New password must be different from your current password."
        );
        return;
      }

      try {
        setChangingPassword(true);

        await changePassword({
          currentPassword,
          newPassword,
        });

        toast.success(
          "Password changed successfully."
        );

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error(
          "Failed to change password:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Unable to change password."
        );
      } finally {
        setChangingPassword(false);
      }
    };

  /* ==========================================
     LOADING
  ========================================== */

  if (loadingSettings) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-6">
        <p className="text-gray-500 dark:text-gray-400">
          Loading settings...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">

      {/* HEADER */}

      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Preferences
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
          Manage your account preferences and
          personalize your KanuorieTech
          experience.
        </p>
      </div>

      {/* =====================================
          APPEARANCE
      ===================================== */}

      <Card className="mb-6 overflow-hidden border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
        <div className="divide-y divide-gray-200 dark:divide-white/10">

          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Choose whether KanuorieTech
                uses light or dark mode.
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>

              <input
                type="checkbox"
                checked={Boolean(darkMode)}
                onChange={
                  handleThemeToggle
                }
                disabled={savingSettings}
                className="peer sr-only"
                aria-label="Toggle dark mode"
              />

              <span className="relative h-7 w-12 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 dark:bg-gray-700 dark:peer-checked:bg-blue-500">
                <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 p-6 sm:p-8">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Current Theme
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your current appearance
                preference.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {darkMode
                ? "Dark"
                : "Light"}
            </span>
          </div>

        </div>
      </Card>

      {/* =====================================
          NOTIFICATIONS
      ===================================== */}

      <Card className="mb-6 overflow-hidden border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">

        <div className="flex items-start gap-4 border-b border-gray-200 p-6 dark:border-white/10 sm:p-8">
          <Bell className="mt-1 h-6 w-6 text-blue-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose which notifications you
              want to receive.
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-white/10">

          <SettingToggle
            label="Course updates"
            description="Get notified about course activity and updates."
            checked={
              settings.notifications.courses
            }
            onChange={() =>
              toggleNotification(
                "courses"
              )
            }
          />

          <SettingToggle
            label="New resources"
            description="Receive notifications when new books and learning resources are added."
            checked={
              settings.notifications.resources
            }
            onChange={() =>
              toggleNotification(
                "resources"
              )
            }
          />

          <SettingToggle
            label="Product updates"
            description="Stay informed about new KanuorieTech products."
            checked={
              settings.notifications.products
            }
            onChange={() =>
              toggleNotification(
                "products"
              )
            }
          />

          <SettingToggle
            label="Account notifications"
            description="Important notifications about your account."
            checked={
              settings.notifications.account
            }
            onChange={() =>
              toggleNotification(
                "account"
              )
            }
          />

          <SettingToggle
            label="Promotional notifications"
            description="Receive promotional announcements and special offers."
            checked={
              settings.notifications.promotions
            }
            onChange={() =>
              toggleNotification(
                "promotions"
              )
            }
          />

        </div>
      </Card>

      {/* =====================================
          EMAIL PREFERENCES
      ===================================== */}

      <Card className="mb-6 overflow-hidden border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">

        <div className="flex items-start gap-4 border-b border-gray-200 p-6 dark:border-white/10 sm:p-8">
          <Mail className="mt-1 h-6 w-6 text-blue-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Email Preferences
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Control which emails KanuorieTech
              sends to you.
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-white/10">

          <SettingToggle
            label="Security & account emails"
            description="Important security and account-related messages."
            checked={
              settings.emailPreferences.security
            }
            onChange={() => {}}
            disabled
          />

          <SettingToggle
            label="Course updates"
            description="Receive course-related emails."
            checked={
              settings.emailPreferences.courses
            }
            onChange={() =>
              toggleEmailPreference(
                "courses"
              )
            }
          />

          <SettingToggle
            label="New resources"
            description="Receive emails about new books and learning resources."
            checked={
              settings.emailPreferences.resources
            }
            onChange={() =>
              toggleEmailPreference(
                "resources"
              )
            }
          />

          <SettingToggle
            label="Product updates"
            description="Receive emails about KanuorieTech products."
            checked={
              settings.emailPreferences.products
            }
            onChange={() =>
              toggleEmailPreference(
                "products"
              )
            }
          />

          <SettingToggle
            label="Newsletter"
            description="Receive the KanuorieTech newsletter."
            checked={
              settings.emailPreferences.newsletter
            }
            onChange={() =>
              toggleEmailPreference(
                "newsletter"
              )
            }
          />

          <SettingToggle
            label="Promotional emails"
            description="Receive promotional and marketing emails."
            checked={
              settings.emailPreferences.promotions
            }
            onChange={() =>
              toggleEmailPreference(
                "promotions"
              )
            }
          />

        </div>
      </Card>

      {/* =====================================
          SECURITY
      ===================================== */}

      <Card className="overflow-hidden border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">

        <div className="flex items-start gap-4 border-b border-gray-200 p-6 dark:border-white/10 sm:p-8">
          <Lock className="mt-1 h-6 w-6 text-blue-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Keep your KanuorieTech account
              secure.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handleChangePassword
          }
          className="space-y-6 p-6 sm:p-8"
        >

          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={
              passwords.currentPassword
            }
            onChange={
              handlePasswordChange
            }
            visible={
              showPasswords.current
            }
            onToggle={() =>
              setShowPasswords(
                (prev) => ({
                  ...prev,
                  current:
                    !prev.current,
                })
              )
            }
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={
              passwords.newPassword
            }
            onChange={
              handlePasswordChange
            }
            visible={
              showPasswords.new
            }
            onToggle={() =>
              setShowPasswords(
                (prev) => ({
                  ...prev,
                  new: !prev.new,
                })
              )
            }
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={
              passwords.confirmPassword
            }
            onChange={
              handlePasswordChange
            }
            visible={
              showPasswords.confirm
            }
            onToggle={() =>
              setShowPasswords(
                (prev) => ({
                  ...prev,
                  confirm:
                    !prev.confirm,
                })
              )
            }
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={changingPassword}
            >
              Change Password
            </Button>
          </div>

        </form>
      </Card>
    </section>
  );
}

/* ==========================================
   SETTING TOGGLE
========================================== */

function SettingToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">

      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {label}
        </h3>

        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <label
        className={`inline-flex shrink-0 items-center gap-3 ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {checked ? "On" : "Off"}
        </span>

        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />

        <span className="relative h-7 w-12 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 dark:bg-gray-700">
          <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </span>
      </label>
    </div>
  );
}

/* ==========================================
   PASSWORD INPUT
========================================== */

function PasswordInput({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          minLength={6}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
        >
          {visible ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
}