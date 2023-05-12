import { useState } from "react";
import s from "../todos.module.scss";

const priorities = ["A", "B", "C"];

function Priority({ priority }: { priority: { current: number } }) {
  const [_, render] = useState(false);

  return (
    <div className={s.item}>
      <span>Priority</span>
      <ul className={s.list}>
        {priorities.map((i, ind) => (
          <li
            key={ind}
            className={ind === priority.current ? s.active : ""}
            onClick={() => {
              priority.current = ind;
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

export default Priority;
