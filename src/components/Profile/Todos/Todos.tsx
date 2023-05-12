import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import s from "./todos.module.scss";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { url } from "../../../url";
import { f } from "../../../Foo/fetch";
import { setMess } from "../../../store/reducers/messSlice";
import { Todo, todo } from "../../../store/reducers/userSlice";

function Todos() {
  const id = useAppSelector((s) => s.userSlice.user.id);
  const todos = useAppSelector((s) => s.userSlice.user.todos);
  const [addingTodo, setAddingTodo] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [del, setDelete] = useState("");
  const [edit, setEdit] = useState<todo | null>(null);
  const [editedTodo, setEditTodo] = useState<todo | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!submit) return;
    if (edit && editedTodo) {
      f(
        url + "api/update/todo",
        (res) => {
          dispatch(setMess(res));
        },
        { task: edit.task, todo: editedTodo, id }
      );
      setEdit(null);
      setSubmit(false);
    } else {
      f(
        url + "api/add/todo",
        (res) => {
          if (res[0]) dispatch(setMess([true, "Todo has been added"]));
          else dispatch(setMess([false, res[1]]));
        },
        todos.at(-1)
      );
      setSubmit(false);
    }
  }, [todos]);

  useEffect(() => {
    if (!del) return;
    f(
      url + "api/delete/todo",
      (res) => {
        dispatch(setMess(res));
      },
      { task: del, id }
    );
  }, [del]);

  return (
    <div className={s.todos}>
      {!addingTodo ? (
        <>
          <ul className={s.tasks}>
            {todos.length !== 0 ? (
              todos.map((i, ind) => (
                <li key={ind}>
                  <span>{i.task}</span>
                  <b>
                    PRIORITY: <s>{i.priority === 0 ? "A" : i.priority === 1 ? "B" : "C"}</s>
                  </b>
                  <div>
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        setAddingTodo(true);
                        setEdit(i);
                      }}
                    />
                    <i
                      className="fa-solid fa-trash-can"
                      onClick={() => {
                        if (window.confirm("Are you sure?")) {
                          dispatch(Todo(["del", ind]));
                          setDelete(i.task);
                        }
                      }}
                    />
                  </div>
                </li>
              ))
            ) : (
              <li className={s.empty}>Empty</li>
            )}
          </ul>
          <button className={s.addNewTask} onClick={() => setAddingTodo(true)}>
            Add a new task
          </button>
        </>
      ) : edit ? (
        <TodoForm
          setSubmit={setSubmit}
          setAdding={setAddingTodo}
          setEdit={setEdit}
          fields={{ task: edit.task, priority: edit.priority, reasons: edit.reasons, days: edit.days, extime: edit.extime }}
          onClick={(todo) => {
            dispatch(Todo(["edit", { task: edit.task, todo }]));
            setEditTodo(todo);
            setSubmit(true);
            setAddingTodo(false);
          }}
        />
      ) : (
        <TodoForm setSubmit={setSubmit} setAdding={setAddingTodo} />
      )}
    </div>
  );
}

export default Todos;
