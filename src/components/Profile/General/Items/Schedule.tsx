import { useAppDispatch, useAppSelector } from "../../../../store/store";

import TimePick from "../TimePick";
import { f } from "../../../../Foo/fetch";
import { url } from "../../../../url";
import { setMess } from "../../../../store/reducers/messSlice";
import { setSchedule } from "../../../../store/reducers/userSlice";
import s from "../general.module.scss";

function Schedule() {
  const uid = useAppSelector((s) => s.userSlice.user.id);
  const userSchedule: string = useAppSelector((s) => s.userSlice.user.schedule);
  const dispatch = useAppDispatch();

  return (
    <div className={s.item}>
      <span>Schedule</span>
      <TimePick
        onClick={(currentTime) => {
          f(
            url + `api/update/schedule/${uid}`,
            (res) => {
              if (res[0]) {
                dispatch(setMess([true, "Changes have been saved"]));
                dispatch(setSchedule(res[1]));
              } else setMess([false, res[1] as string]);
            },
            {
              id: 0,
              time: currentTime,
            }
          );
        }}
        time={
          userSchedule
            .split(" - ")[0]
            .split(":")
            .map((i, ind) => {
              if (ind === 1) return -Number(i) / 5;
              return -Number(i);
            }) as [number, number]
        }
      />
      <TimePick
        onClick={(currentTime) => {
          f(
            url + `api/update/schedule/${uid}`,
            (res) => {
              if (res[0]) {
                dispatch(setMess([true, "Changes have been saved"]));
                dispatch(setSchedule(res[1]));
              } else setMess([false, res[1] as string]);
            },
            {
              id: 1,
              time: currentTime,
            }
          );
        }}
        time={
          userSchedule
            .split(" - ")[1]
            .split(":")
            .map((i, ind) => {
              if (ind === 1) return -Number(i) / 5;
              return -Number(i);
            }) as [number, number]
        }
      />
    </div>
  );
}

export default Schedule;
