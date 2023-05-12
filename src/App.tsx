import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/store";

import Mess from "./components/Items/Mess/Mess";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import { setGAuth } from "./store/reducers/googleAuth";
import { deleteCookie, getCookie } from "./Foo/cookies";
import { f } from "./Foo/fetch";
import { url } from "./url";
import { setOldTest, setStats, setTodos, setUser, setUserLoad } from "./store/reducers/userSlice";
import s from "./app.module.scss";

const w: Window & { gapi?: any } = window;

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = getCookie("user");
    if (user) {
      f(
        url + "api/check/user",
        (res) => {
          if (res[0]) {
            dispatch(setUser(res[1]));
            dispatch(setUserLoad());
            f(
              url + "api/get/todaytodos",
              (today: [boolean, string[]]) => {
                if (today[0]) {
                  dispatch(setOldTest());
                  dispatch(setTodos(today[1]));
                } else {
                  f(
                    url + "api/get/todayalltodos",
                    (todos) => {
                      dispatch(
                        setTodos(
                          todos.map((i) => {
                            i.reasons = i.reasons.map((s: string) => [false, s]);
                            return i;
                          })
                        )
                      );
                    },
                    { id: res[1].id }
                  );
                }
              },
              { id: res[1].id }
            );
            f(
              url + "api/get/stats",
              (res) => {
                if (res[0]) {
                  dispatch(setStats(res[1]));
                }
              },
              { id: res[1].id }
            );
          } else {
            deleteCookie("user");
            dispatch(setUserLoad());
          }
        },
        JSON.parse(user)
      );
    } else dispatch(setUserLoad());
    w.gapi.load("auth2", () => {
      w.gapi.auth2
        .init({
          client_id: "696785622892-tnqn3urt8rbb3310anssas12nos42i7m.apps.googleusercontent.com",
          scope: "email",
          plugin_name: "Web client 1",
        })
        .then(
          (res: any) => dispatch(setGAuth(res)),
          (err: any) => console.log(err)
        );
    });
  }, []);

  return (
    <div className={s.app}>
      <Header />
      <div className={s.main}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="*" element={404} />
        </Routes>
      </div>
      <Mess />
    </div>
  );
}

export default App;
