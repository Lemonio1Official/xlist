import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Form, { fields } from "../../Items/Form/Form";
import Priority from "./Items/Priority";
import Reasons from "./Items/Reasons";
import Days from "./Items/Days";
import s from "./todos.module.scss";
import { Todo, todo } from "../../../store/reducers/userSlice";

interface IProps {
  setAdding: (p: boolean) => void;
  setSubmit: (p: boolean) => void;
  setEdit?: (p: null) => void;
  onClick?: (p: any) => void;
  fields?: {
    task: string;
    extime: number;
    priority: number;
    reasons: string[];
    days: number[];
  };
}

function TodoForm({ setAdding, setSubmit, fields, setEdit, onClick }: IProps) {
  const id = useAppSelector((s) => s.userSlice.user.id);
  const todos = useAppSelector((s) => s.userSlice.user.todos);
  const priority = useRef(fields ? fields.priority : 1);
  const reasons = useRef<string[]>(fields ? [...fields.reasons] : []);
  const days = useRef(fields ? [...fields.days] : [0, 1, 2, 3, 4]);
  const dispatch = useAppDispatch();

  return (
    <Form
      fields={{ task: fields ? fields.task : "", extime: fields ? fields.extime.toString() : "" }}
      className={s.form}
      checkout={{
        task: (v: string) => {
          if (v.length === 0 || v.length > 100) return "Invalid value length";
          if (!fields && todos.find((i) => i.task === v)) return "Task already exists";
          return "";
        },
      }}
    >
      <>
        <div className={s.title}>{fields ? "Edit task" : "New task"}</div>
        <i
          className={"fa-solid fa-xmark " + s.close}
          onClick={() => {
            setAdding(false);
            fields && setEdit!(null);
          }}
        />
        <div className={s.item}>
          <span>Task</span>
          <div className={s.fields}>
            <input type="text" name="task" />
          </div>
          <span>Execution time</span>
          <div className={s.fields}>
            <input type="number" name="extime" />
          </div>
        </div>
        <Priority priority={priority} />
        <Reasons reasons={reasons} />
        <Days days={days} />
        <button
          onClick={(e: React.MouseEvent, fields: fields = {}) => {
            if (onClick) onClick({ id, ...fields, priority: priority.current, reasons: reasons.current, days: days.current });
            else {
              dispatch(
                Todo(["add", { id, ...fields, priority: priority.current, reasons: reasons.current, days: days.current } as todo])
              );
              setSubmit(true);
              setAdding(false);
            }
          }}
        >
          Confirm
        </button>
      </>
    </Form>
  );
}

export default TodoForm;
