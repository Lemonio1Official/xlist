import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import s from "../todos.module.scss";
import { setMess } from "../../../../store/reducers/messSlice";

function Reasons({ reasons }: { reasons: { current: string[] } }) {
  const userReasons = useAppSelector((s) => s.userSlice.user.reasons);
  const [adding, setAdding] = useState(false);
  const [_, render] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className={s.item}>
      <div className={s.addreason}>
        Reason for exclusion <b onClick={() => setAdding(true)}>ADD</b>
      </div>
      <ul className={s.reasons}>
        {reasons.current.length === 0 ? (
          <li className={s.empty}>Empty</li>
        ) : (
          reasons.current.map((i, ind) => {
            return (
              <li key={ind}>
                {i}
                <i
                  className={"fa-solid fa-square-minus " + s.delete}
                  onClick={() => {
                    reasons.current = reasons.current.filter((_, index) => index !== ind);
                    render((i) => !i);
                  }}
                />
              </li>
            );
          })
        )}
      </ul>
      {adding && (
        <div className={s.addReason} onMouseLeave={() => setAdding(false)}>
          {(JSON.parse(userReasons) as string[]).map((i, ind) => (
            <p
              key={ind}
              onClick={() => {
                if (reasons.current.find((s) => s === i)) {
                  dispatch(setMess([false, "You have already added this"]));
                  return;
                }
                reasons.current.push(i);
                setAdding(false);
                render((i) => !i);
              }}
            >
              {i}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reasons;
