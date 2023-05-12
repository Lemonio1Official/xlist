import { useEffect } from "react";
import { markReason, setOldTest, setTodos } from "../../store/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import todo1 from "./img/todo1.jpg";
import todo2 from "./img/todo2.jpg";
import todo3 from "./img/todo3.jpg";
import todo4 from "./img/todo4.jpg";
import { f } from "../../Foo/fetch";
import { url } from "../../url";
import { setMess } from "../../store/reducers/messSlice";
import s from "./main.module.scss";

function Main() {
  const [user, todos, test, oldTest] = useAppSelector((s) => [
    s.userSlice.user,
    s.userSlice.todos,
    s.userSlice.test,
    s.userSlice.oldTest,
  ]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!test) return;
    f(
      url + "api/set/todaytodos/" + user.id,
      (res) => {
        if (res[0]) {
          dispatch(setMess([true, "Test passed"]));
          dispatch(setTodos(res[1]));
          dispatch(setOldTest());
        } else dispatch(setMess(res));
      },
      { todos }
    );
  }, [test]);

  return (
    <main className={s.main}>
      {user.email ? (
        <>
          {todos.length !== 0 ? (
            oldTest ? (
              <ul className={s.xlist}>
                {todos.map((i, ind) => (
                  <li key={ind} className={`${i.done && s.done}`}>
                    <span>{i.task}</span>
                    <div>
                      <s>{i.time}</s>
                      <i
                        className="fa-solid fa-circle-check"
                        onClick={() => {
                          f(
                            url + "api/set/task/done",
                            (res) => {
                              if (res[0]) dispatch(setTodos(res[1]));
                            },
                            { id: user.id, task: i.task }
                          );
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              todos.map((i) =>
                i.reasons.map((i, ind) => {
                  if (!i[0])
                    return (
                      <div className={s.questions} key={ind}>
                        <span>{i[1]} ?</span>
                        <div>
                          <button onClick={() => dispatch(markReason([true, i[1]]))}>YES</button>
                          <button onClick={() => dispatch(markReason([false, i[1]]))}>NO</button>
                        </div>
                      </div>
                    );
                })
              )
            )
          ) : (
            <div className={s.questions}>
              <span>There are no task for today</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={s.arts}>
            <span>Plan your day with XLIST</span>
            <div>
              <img src={todo1} alt="jpg" />
              <img src={todo2} alt="jpg" />
            </div>
          </div>
          <div className={s.arts}>
            <span>A handy list that adapts to you</span>
            <div>
              <img src={todo3} alt="jpg" />
              <img src={todo4} alt="jpg" />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default Main;
