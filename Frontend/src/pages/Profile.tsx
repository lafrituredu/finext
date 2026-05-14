import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  deleteCurrentUserAccount,
  deleteCurrentUserAvatar,
  getCurrentUser,
  updateCurrentUser,
  uploadCurrentUserAvatar,
  type UpdateUserProfilePayload,
  type UserProfile
} from "../api/AuthServices";
import Confirmation from "../components/materials/Confirmation";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileSummary from "../components/profile/ProfileSummary";
import {
  emptyProfileForm,
  profileFormToPayload,
  userToProfileForm
} from "../utils/profileMappers";
import TrashIcon from "/src/assets/icons/Trashcan.svg?react";

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

const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

const notifyUserProfileUpdated = (user: UserProfile) => {
  window.dispatchEvent(
    new CustomEvent<UserProfile>("user-profile-updated", { detail: user })
  );
};

function Profile() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileFormData>(emptyProfileForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
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

  const handleAvatarChange = async (file: File) => {
    setAvatarSaving(true);
    setError("");
    setMessage("");

    try {
      const updatedUser = await uploadCurrentUserAvatar(file);
      setUser(updatedUser);
      notifyUserProfileUpdated(updatedUser);
      setMessage(t("avatar_saved"));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("avatar_save_error")));
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleAvatarDelete = async () => {
    setAvatarSaving(true);
    setError("");
    setMessage("");

    try {
      const updatedUser = await deleteCurrentUserAvatar();
      setUser(updatedUser);
      notifyUserProfileUpdated(updatedUser);
      setMessage(t("avatar_deleted"));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("avatar_delete_error")));
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const updatedUser = await updateCurrentUser(profileFormToPayload(form));
      setUser(updatedUser);
      notifyUserProfileUpdated(updatedUser);
      localStorage.setItem("user", updatedUser.username);
      setMessage(t("saved"));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("save_error")));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setAccountDeleting(true);
    setError("");
    setMessage("");

    try {
      await deleteCurrentUserAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowDeleteAccountConfirm(false);
      navigate("/login", {
        replace: true,
        state: { message: t("delete_account_success") }
      });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("delete_account_error")));
      setShowDeleteAccountConfirm(false);
    } finally {
      setAccountDeleting(false);
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
    <>
      {showDeleteAccountConfirm && (
        <Confirmation
          Icon={TrashIcon}
          close={() => setShowDeleteAccountConfirm(false)}
          onConfirm={handleDeleteAccount}
          confirmLabel={
            accountDeleting ? t("deleting_account") : t("confirm_delete_account")
          }
          cancelLabel={t("cancel_delete_account")}
          confirmDisabled={accountDeleting}
        >
          {t("delete_account_confirm")}
        </Confirmation>
      )}

      <div className="min-h-full w-full p-10 inter">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="mont_semibold text-4xl">{t("title")}</h2>
          <p className="text-[#7B7B7B] dark:text-dark-text max-w-3xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid xl:grid-cols-[360px_1fr] grid-cols-1 gap-6">
          <ProfileSummary
            form={form}
            user={user}
            roleLabel={roleLabel}
            avatarSaving={avatarSaving}
            accountDeleting={accountDeleting}
            onAvatarChange={handleAvatarChange}
            onAvatarDelete={handleAvatarDelete}
            onDeleteAccountClick={() => setShowDeleteAccountConfirm(true)}
          />
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
    </>
  );
}

export default Profile;
