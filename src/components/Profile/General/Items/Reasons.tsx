import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { Reason } from "../../../../store/reducers/userSlice";
import { f } from "../../../../Foo/fetch";
import { url } from "../../../../url";
import { setMess } from "../../../../store/reducers/messSlice";
import s from "../general.module.scss";

function Reasons() {
  const uid = useAppSelector((s) => s.userSlice.user.id);
  const reasons = useAppSelector((s) => s.userSlice.user.reasons);
  const [addingReason, setAddingReason] = useState(false);
  const [value, setValue] = useState("");
  const [submit, setSubmit] = useState(false);
  const reasonsArr: string[] = JSON.parse(reasons);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!submit) return;
    setSubmit(false);
    f(
      url + `api/update/reasons/${uid}`,
      (res) => {
        if (res[0]) {
          dispatch(setMess([true, "Changes have been saved"]));
        } else setMess([false, res[1] as string]);
      },
      { reasons }
    );
  }, [reasons]);

  return (
    <div className={s.item + " " + s.freetime}>
      <div className={s.top}>
        <span>Reasons to skip</span>
        <button onClick={() => setAddingReason(true)}>Add</button>
      </div>
      <ul className={s.list}>
        {reasonsArr.map((i, ind) => (
          <li key={ind}>
            <p>{i}</p>
            <i
              className={"fa-solid fa-square-minus " + s.delete}
              onClick={() => {
                dispatch(Reason(["", ind]));
                setSubmit(true);
              }}
            />
          </li>
        ))}
        {reasonsArr.length === 0 && <li className={s.empty}>Empty</li>}
      </ul>
      {addingReason && (
        <div className={s.addingReason}>
          <i
            className={"fa-solid fa-xmark " + s.close}
            onClick={() => {
              setAddingReason(false);
              setValue("");
            }}
          />
          <input type="text" placeholder="Why you can skip the task" value={value} onChange={(e) => setValue(e.target.value)} />
          <button
            onClick={() => {
              for (const i of reasonsArr) {
                if (i === value) {
                  dispatch(setMess([false, "There's already a reason"]));
                  return;
                }
              }
              dispatch(Reason(["add", value]));
              setValue("");
              setAddingReason(false);
              setSubmit(true);
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default Reasons;
