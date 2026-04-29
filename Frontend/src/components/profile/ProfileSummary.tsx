import { useTranslation } from "react-i18next";

import type { UserProfile } from "../../api/AuthServices";
import type { ProfileFormData, ProfileRole } from "../../pages/Profile";
import CheckIcon from "/src/assets/icons/Check-icon.svg?react";
import ProfileIcon from "/src/assets/icons/Profile-icon.svg?react";

type ProfileSummaryProps = {
  form: ProfileFormData;
  user: UserProfile | null;
  roleLabel: (role: ProfileRole) => string;
};

function ProfileSummary({ form, user, roleLabel }: ProfileSummaryProps) {
  const { t } = useTranslation("profile");

  return (
    <aside className="bg-[#F9F9FA] dark:bg-dark-card border border-[#0000001a] dark:border-[#1d2344] rounded-2xl p-7 h-fit">
      <p className="montserrat font-semibold mb-6 flex items-center gap-2">
        <ProfileIcon className="size-6" />
        {t("account_summary")}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="size-16 rounded-full bg-[#84A2EB66] text-primary flex items-center justify-center mont_semibold text-2xl uppercase">
          {(form.full_name || form.username || "F").charAt(0)}
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

      <div className="space-y-4">
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
    </aside>
  );
}

export default ProfileSummary;
