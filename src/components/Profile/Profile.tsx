import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../store/store";

import General from "./General";
import s from "./profile.module.scss";
import Todos from "./Todos/Todos";
import Stats from "./Stats/Stats";

const sections: [string, JSX.Element][] = [
  ["general", <General />],
  ["todos", <Todos />],
  ["stats", <Stats />],
];

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.userSlice.user);
  const userLoad = useAppSelector((s) => s.userSlice.load);

  useEffect(() => {
    if (userLoad) if (user.email === "") navigate("/");
  }, [user]);

  return userLoad ? (
    <div className={s.profile}>
      <ul className={s.list}>
        <p>
          Profile
          <i className="fa-solid fa-sliders" />
        </p>
        {sections.map((i, ind) => (
          <li key={ind} className={location.pathname === `/profile/${i[0]}` ? s.active : ""}>
            <Link to={i[0]}>{i[0]}</Link>
          </li>
        ))}
      </ul>
      <section>
        <Routes>
          {sections.map((i, ind) => (
            <Route path={i[0]} element={i[1]} key={ind} />
          ))}
        </Routes>
      </section>
    </div>
  ) : (
    <div></div>
  );
}

export default Profile;
