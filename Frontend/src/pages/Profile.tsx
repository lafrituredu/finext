import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  getCurrentUser,
  updateCurrentUser,
  type UpdateUserProfilePayload,
  type UserProfile
} from "../api/AuthServices";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileSummary from "../components/profile/ProfileSummary";
import {
  emptyProfileForm,
  profileFormToPayload,
  userToProfileForm
} from "../utils/profileMappers";

export type ProfileRole = UpdateUserProfilePayload["rol"];

export type ProfileFormData = {
  username: string;
  full_name: string;
  phone_number: string;
  rol: ProfileRole;
  dni: string;
  birth_date: string;
  modulo_iva: string;
  civil_state: string;
  company: string;
  irpf: string;
};

function Profile() {
  const { t } = useTranslation("profile");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileFormData>(emptyProfileForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data);
        setForm(userToProfileForm(data));
      })
      .catch(() => setError(t("load_error")))
      .finally(() => setLoading(false));
  }, [t]);

  const roleLabel = (role: ProfileRole) => t(`role_${role}`);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFieldChange = (name: string, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleRoleChange = (role: ProfileRole) => {
    setForm((current) => ({ ...current, rol: role }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const updatedUser = await updateCurrentUser(profileFormToPayload(form));
      setUser(updatedUser);
      localStorage.setItem("user", updatedUser.username);
      setMessage(t("saved"));
    } catch (err: any) {
      setError(err.response?.data?.message || t("save_error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full p-10 inter flex items-center justify-center">
        <p className="text-[#7B7B7B] dark:text-dark-text">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full p-10 inter">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="mont_semibold text-4xl">{t("title")}</h2>
        <p className="text-[#7B7B7B] dark:text-dark-text max-w-3xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid xl:grid-cols-[360px_1fr] grid-cols-1 gap-6">
        <ProfileSummary form={form} user={user} roleLabel={roleLabel} />
        <ProfileForm
          form={form}
          user={user}
          saving={saving}
          message={message}
          error={error}
          roleLabel={roleLabel}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onFieldChange={handleFieldChange}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
}

export default Profile;
