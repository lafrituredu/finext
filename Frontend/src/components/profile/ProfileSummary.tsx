import { useTranslation } from "react-i18next";

import type { UserProfile } from "../../api/AuthServices";
import type { ProfileFormData, ProfileRole } from "../../pages/Profile";
import CheckIcon from "/src/assets/icons/Check-icon.svg?react";
import ProfileIcon from "/src/assets/icons/Profile-icon.svg?react";
import PencilIcon from "/src/assets/icons/Pencil.svg?react";
import TrashIcon from "/src/assets/icons/Trashcan.svg?react";

type ProfileSummaryProps = {
  form: ProfileFormData;
  user: UserProfile | null;
  roleLabel: (role: ProfileRole) => string;
  avatarSaving: boolean;
  accountDeleting: boolean;
  onAvatarChange: (file: File) => void;
  onAvatarDelete: () => void;
  onDeleteAccountClick: () => void;
};

function ProfileSummary({
  form,
  user,
  roleLabel,
  avatarSaving,
  accountDeleting,
  onAvatarChange,
  onAvatarDelete,
  onDeleteAccountClick
}: ProfileSummaryProps) {
  const { t } = useTranslation("profile");
  // Use avatar_url from the API. If it does not exist, use avatar.
  const avatarUrl = user?.avatar_url || user?.avatar;

  return (
    <aside className="bg-[#F9F9FA] dark:bg-dark-card border border-[#0000001a] dark:border-[#1d2344] rounded-2xl p-7 h-fit">
      <p className="montserrat font-semibold mb-6 flex items-center gap-2">
        <ProfileIcon className="size-6" />
        {t("account_summary")}
      </p>

      <div className="flex items-center gap-4 mb-6">
        {/* Show the avatar image or the first letter of the user name. */}
        <div className="size-16 rounded-full bg-[#84A2EB66] text-primary flex items-center justify-center mont_semibold text-2xl uppercase overflow-hidden shrink-0">
          {avatarUrl ? (
            <img
              className="size-full object-cover"
              src={avatarUrl}
              alt={t("avatar_alt")}
            />
          ) : (
            (form.full_name || form.username || "F").charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <p className="mont_semibold text-xl truncate">
            {form.full_name || form.username}
          </p>
          <p className="text-[#7B7B7B] dark:text-dark-text truncate">
            @{form.username}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {/* Upload a new avatar file. */}
        <label className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-primary text-white text-sm cursor-pointer shadow-md disabled:opacity-60">
          <PencilIcon className="size-4" />
          {avatarSaving ? t("avatar_saving") : t("change_avatar")}
          <input
            className="hidden"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={avatarSaving}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onAvatarChange(file);
              }
              event.target.value = "";
            }}
          />
        </label>

        {avatarUrl && (
          // Delete avatar button is shown only when the user has an avatar.
          <button
            type="button"
            disabled={avatarSaving}
            onClick={onAvatarDelete}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-[#0000001a] dark:border-[#1d2344] text-sm text-red-500 disabled:opacity-60 cursor-pointer"
          >
            <TrashIcon className="size-4" />
            {t("delete_avatar")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Short account data. */}
        <div>
          <p className="text-sm text-[#7B7B7B] dark:text-dark-text">
            {t("role")}
          </p>
          <p className="mt-1 inline-flex rounded-full bg-[#84A2EB33] text-primary px-3 py-1 text-sm montserrat">
            {roleLabel(form.rol)}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#7B7B7B] dark:text-dark-text">
            {t("email")}
          </p>
          <p className="mt-1 break-all">{user?.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <CheckIcon className="size-5 text-green-500" />
          <span
            className={
              user?.email_verified_at ? "text-green-500" : "text-[#FF9D00]"
            }
          >
            {user?.email_verified_at ? t("verified") : t("pending")}
          </span>
        </div>
      </div>

      <div className="mt-7 pt-5 border-t border-[#0000001a] dark:border-[#1d2344]">
        {/* Dangerous action: delete the full account. */}
        <p className="montserrat text-sm font-semibold text-[#7B7B7B] dark:text-dark-text">
          {t("danger_zone")}
        </p>
        <p className="mt-2 text-xs text-[#7B7B7B] dark:text-dark-text">
          {t("delete_account_hint")}
        </p>
        <button
          type="button"
          disabled={accountDeleting}
          onClick={onDeleteAccountClick}
          className="mt-3 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-full border border-red-500/40 text-red-500 text-xs hover:bg-red-500/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <TrashIcon className="size-4" />
          {accountDeleting ? t("deleting_account") : t("delete_account")}
        </button>
      </div>
    </aside>
  );
}

export default ProfileSummary;
