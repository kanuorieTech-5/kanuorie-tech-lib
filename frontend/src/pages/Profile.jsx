import { useState } from "react";
import toast from "react-hot-toast";

import { Card, Button,} from "../components/common";
import { Input,} from "../components/ui";
import { useAuth,} from "../contexts/AuthContext";

import {
  updateProfile,
  uploadAvatar,
} from "../services";

export default function Profile() {

  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    firstName: user?.firstName || "",

    lastName: user?.lastName || "",

    username: user?.username || "",

    email: user?.email || "",

    bio: user?.bio || "",

  });

  const change = ({ target }) =>

    setForm(prev => ({
      ...prev,
      [target.name]: target.value,
    }));

  const saveProfile = async () => {

    try {

      setLoading(true);

      const res = await updateProfile(form);

      setUser(res.data);

      toast.success("Profile updated successfully.");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to update profile."
      );

    } finally {

      setLoading(false);

    }

  };

  const changeAvatar = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      const res = await uploadAvatar(file);

      setUser({
        ...user,
        avatar: res.url,
      });

      toast.success("Profile photo updated.");

    } catch {

      toast.error("Upload failed.");

    }

  };

  return (

    <section className="mx-auto max-w-4xl px-6 py-20">

      <Card className="p-8">

        <div className="mb-10 flex flex-col items-center">

          <img
            src={
              user?.avatar ||
              "/images/default-avatar.png"
            }
            alt="Profile"
            className="mb-5 h-36 w-36 rounded-full object-cover"
          />

          <input
            type="file"
            onChange={changeAvatar}
          />

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={change}
          />

          <Input
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={change}
          />

          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={change}
          />

          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={change}
          />

        </div>

        <textarea
          rows={5}
          name="bio"
          value={form.bio}
          onChange={change}
          placeholder="Bio"
          className="mt-6 w-full rounded-lg border p-4"
        />

        <Button
          loading={loading}
          onClick={saveProfile}
          className="mt-8"
        >
          Save Changes
        </Button>

      </Card>

    </section>

  );

}