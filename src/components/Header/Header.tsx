import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";

import { logOut } from "../../store/reducers/userSlice";
import { setMess } from "../../store/reducers/messSlice";
import { deleteCookie } from "../../Foo/cookies";
import logo from "./logo.png";
import s from "./header.module.scss";

function Header() {
  const user = useAppSelector((s) => s.userSlice.user);
  const GoogleAuth = useAppSelector((s) => s.googleAuth.auth);
  const dispatch = useAppDispatch();

  return (
    <header className={s.header}>
      <Link to="/" className={s.logo}>
        <img src={logo} alt="png" />
        LIST
      </Link>
      {user.email !== "" ? (
        <div className={s.user}>
          <Link to="profile/general">{user!.email.slice(0, 2)}</Link>
          <div
            className={s.button}
            onClick={() => {
              GoogleAuth.signOut();
              dispatch(logOut());
              dispatch(setMess([true, "You are logged out"]));
              deleteCookie("user");
            }}
          >
            <span>Log out</span>
          </div>
        </div>
      ) : (
        <Link to="/login" className={s.login}>
          LOG IN
        </Link>
      )}
    </header>
  );
}

export default Header;
