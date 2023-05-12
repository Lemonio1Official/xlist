import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";

import TimePick from "../TimePick";
import { FreeTime } from "../../../../store/reducers/userSlice";
import { f } from "../../../../Foo/fetch";
import { url } from "../../../../url";
import { setMess } from "../../../../store/reducers/messSlice";
import s from "../general.module.scss";

function Freetime() {
  const uid = useAppSelector((s) => s.userSlice.user.id);
  const schedule = useAppSelector((s) => s.userSlice.user.schedule);
  const freetime = useAppSelector((s) => s.userSlice.user.freetime);
  const [time, setTime] = useState("12:00 - 14:00");
  const [addingFT, setAddingFT] = useState(false);
  const [submit, setSubmit] = useState(false);
  const dispatch = useAppDispatch();
  const freetimeArr: string[] = JSON.parse(freetime);

  useEffect(() => {
    if (!submit) return;
    setSubmit(false);
    f(
      url + `api/update/freetime/${uid}`,
      (res) => {
        if (res[0]) {
          dispatch(setMess([true, "Changes have been saved"]));
        } else setMess([false, res[1] as string]);
      },
      { freetime }
    );
  }, [freetime]);

  return (
    <div className={s.item + " " + s.freetime}>
      <div className={s.top}>
        <span>Free time</span>
        <button onClick={() => setAddingFT(true)}>Add</button>
      </div>
      <ul className={s.list}>
        {freetimeArr.map((i, ind) => (
          <li key={ind}>
            {i}
            <i
              className={"fa-solid fa-square-minus " + s.delete}
              onClick={() => {
                setSubmit(true);
                dispatch(FreeTime(["", ind]));
              }}
            />
          </li>
        ))}
        {freetimeArr.length === 0 && <li className={s.empty}>Empty</li>}
      </ul>
      {addingFT && (
        <div className={s.addFreetime}>
          <i
            className={"fa-solid fa-xmark " + s.close}
            onClick={() => {
              setAddingFT(false);
              setTime("12:00 - 14:00");
            }}
          />
          From
          <TimePick
            onClick={(currTime) => {
              setTime(
                time
                  .split(" - ")
                  .map((i, ind) => {
                    if (ind === 0) return currTime;
                    return i;
                  })
                  .join(" - ")
              );
            }}
            time={[-12, 0]}
          />
          To
          <TimePick
            onClick={(currTime) => {
              setTime(
                time
                  .split(" - ")
                  .map((i, ind) => {
                    if (ind === 1) return currTime;
                    return i;
                  })
                  .join(" - ")
              );
            }}
            time={[-14, 0]}
          />
          <button
            onClick={() => {
              const [sFrom, sTo] = getSumStrTime(schedule);
              const [ftFrom, ftTo] = getSumStrTime(time);
              if (sFrom > ftFrom || sTo < ftTo) {
                dispatch(setMess([false, "It should be on the schedule"]));
                return;
              }
              if (ftFrom > ftTo) {
                dispatch(setMess([false, "Time is incorrect"]));
                return;
              }
              for (const i of freetimeArr) {
                const [iFrom, iTo] = getSumStrTime(i);
                if ((ftFrom > iFrom && ftFrom < iTo) || (ftTo < iTo && ftTo > iFrom)) {
                  dispatch(setMess([false, "This time is already taken"]));
                  return;
                }
              }
              setSubmit(true);
              setAddingFT(false);
              dispatch(FreeTime(["add", time]));
              setTime("12:00 - 14:00");
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function getSumStrTime(arr: string) {
  const strArr = arr.split(" - ");
  return [
    Number(strArr[0].split(":").reduce((acc, i) => (acc += i), "")),
    Number(strArr[1].split(":").reduce((acc, i) => (acc += i), "")),
  ];
}

export default Freetime;
