import React from "react";
import { useTranslation } from "react-i18next";
type IconType = React.FC<React.SVGProps<SVGSVGElement>>

interface ConfirmationProps {
    Icon: IconType
    children: React.ReactNode
    close: () => void
    onConfirm: () => void
    confirmLabel?: string
    cancelLabel?: string
    confirmDisabled?: boolean
}

export function Confirmation({
  Icon,
  children,
  close,
  onConfirm,
  confirmLabel,
  cancelLabel,
  confirmDisabled = false
}:ConfirmationProps) {
  const { t } = useTranslation("utils")
  return (
    <>
        <div className="flex flex-col items-center justify-center fixed bg-[#0000006b] min-w-full min-h-full z-60 top-0 left-0">
            <div className="inter flex flex-col items-center justify-center bg-white dark:bg-dark-background dark:ring-2 dark:ring-dark-card shadow-md rounded-xl p-8 m-2">
                {<Icon className="size-16 text-red-500 my-2"/>}
                <p className="text-xl max-w-100 text-center">{children}</p>
                <div className="flex flex-col justify-between pt-5 gap-4 w-full">
                    <button
                      className="bg-red-400 rounded-full py-2 w-full cursor-pointer select-none hover:scale-104 hover:bg-red-500 
                    transition-all duration-100 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-red-400"
                      onClick={onConfirm}
                      disabled={confirmDisabled}
                    >
                      {confirmLabel ?? t("confirmation.delete")}
                    </button>
                    <button className="bg-background ring-1 ring-gray-300 dark:bg-dark-background dark:ring-dark-card rounded-full py-2 w-full cursor-pointer select-none 
                    hover:scale-104 transition-all duration-100 ease-in-out" onClick={close}>{cancelLabel ?? t("confirmation.abort")}</button>
                </div>
            </div>

        </div>
    </>
  );
}

export default Confirmation;
