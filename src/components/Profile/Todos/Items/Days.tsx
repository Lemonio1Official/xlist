import { useState } from "react";
import { useAppDispatch } from "../../../../store/store";
import { setMess } from "../../../../store/reducers/messSlice";
import s from "../todos.module.scss";

const daysArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Days({ days }: { days: { current: number[] } }) {
  const [_, render] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className={s.item}>
      <ul className={s.list + " " + s.days}>
        {daysArr.map((i, ind) => (
          <li
            key={ind}
            className={days.current.includes(ind) ? s.active : ""}
            onClick={() => {
              if (days.current.includes(ind) && days.current.length === 1) {
                dispatch(setMess([false, "You must select at least one day"]));
                return;
              }
              if (days.current.includes(ind)) days.current = days.current.filter((i) => i !== ind);
              else days.current.push(ind);
              render((i) => !i);
            }}
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Days;
