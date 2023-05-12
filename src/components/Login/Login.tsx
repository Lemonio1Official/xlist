import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";

import Form, { fields } from "../Items/Form/Form";
import google from "../../img/google.png";
import { randomWord } from "../../Foo/captcha";
import { setMess } from "../../store/reducers/messSlice";
import { url } from "../../url";
import { f } from "../../Foo/fetch";
import s from "./login.module.scss";
import { setOldTest, setTodos, setUser, setUserLoad } from "../../store/reducers/userSlice";
import { setCookie } from "../../Foo/cookies";

function Login() {
  const user = useAppSelector((s) => s.userSlice.user);
  const navigate = useNavigate();
  const random_word = randomWord();
  const [login, setLogin] = useState(true);
  const GoogleAuth = useAppSelector((s) => s.googleAuth.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.email !== "") navigate("/");
  }, [user]);

  return (
    <Form
      className={s.login}
      checkout={{
        email: (v: string) => {
          if (v.length < 6 || v.length > 100) return "Invalid value length";
          if (v.indexOf("@") < 0) return "Incorrect mail";
          if (v.indexOf(".") < 0) return "Incorrect mail";
          if (v.indexOf("+") > -1) return "Incorrect mail";
          return "";
        },
        password: (v: string) => {
          if (v.length < 6 || v.length > 255) return "Invalid value length";
          if (v === "qwerty" || v === "qwerty123" || v === "1234567890") return "Too simple password";
          return "";
        },
        captcha: (v: string) => {
          if (v.length !== 6) return "Invalid value length";
          return "";
        },
      }}
    >
      <>
        <div className={s.title}>{login ? "Authorization" : "Registration"}</div>
        <div className={s.fields}>
          <span>Email</span>
          <input type="email" name="email" />
          <span>Password</span>
          <input type="password" name="password" className={s.pass} />
          <div
            className={s.captcha_img}
            style={{ backgroundImage: `url(http://image.captchas.net?client=demo&random=${random_word})` }}
          ></div>
          <input type="text" name="captcha" placeholder="Captcha" />
        </div>
        <button
          onClick={(e: React.MouseEvent, fields: fields = {}) => {
            f(
              url + "api/login/" + (login ? "1" : "0"),
              (res: [boolean, any]) => {
                if (res[0]) {
                  dispatch(setMess([true, login ? "Successful authorization" : "Successful registration"]));
                  dispatch(setUser(res[1]));
                  dispatch(setUserLoad());
                  setCookie("user", JSON.stringify({ email: res[1].email, password: res[1].password }), 3);
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
                } else {
                  dispatch(setMess([false, res[1]]));
                }
              },
              { ...fields, secret_word: random_word }
            );
          }}
        >
          CONFIRM
        </button>
        <div className={s.actions}>
          <Link to="/">Forgot password?</Link>
          <a onClick={() => setLogin((i) => !i)}>{login ? "Don't have an account?" : "Have an account?"}</a>
        </div>
        <div className={s.otherway}>
          <span>or log in with</span>
          <div
            onClick={() =>
              GoogleAuth &&
              GoogleAuth.signIn({ scope: "profile email" }).then(
                (res: any) =>
                  f(
                    url + "api/login/google",
                    (res: [boolean, any]) => {
                      if (res[0]) {
                        dispatch(setMess([true, "Successful login with google"]));
                        dispatch(setUser(res[1]));
                        dispatch(setUserLoad());
                        setCookie("user", JSON.stringify({ email: res[1].email, password: res[1].password }), 3);
                      } else {
                        dispatch(setMess([false, res[1]]));
                      }
                    },
                    { email: res.Cv.qw }
                  ),
                (err: any) => console.log(err)
              )
            }
          >
            <img src={google} alt="png" />
          </div>
        </div>
      </>
    </Form>
  );
}

export default Login;
