import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar"

import { useTranslation } from 'react-i18next';

function Profile() {
  const { t } = useTranslation("error404");
  return (
    <>
        <p>profile works!</p>
    </>
  )
}

export default Profile