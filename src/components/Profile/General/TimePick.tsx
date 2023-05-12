import { useState, useRef } from "react";
import s from "./general.module.scss";

const hours = [
  "23",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "0",
];

const minutes = ["55", "0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "0"];

interface IProps {
  onClick?: (p: any) => void;
  time: [number, number];
}

function TimePick({ time, onClick }: IProps) {
  const [picker, setPicker] = useState(false);
  const hoursScroll = useRef(time[0]);
  const minutesScroll = useRef(time[1]);
  const pickedTime = ("0" + hours[-hoursScroll.current + 1]).slice(-2) + ":" + ("0" + minutes[-minutesScroll.current + 1]).slice(-2);

  const listWheeler = (e: React.WheelEvent<HTMLUListElement>, min = false) => {
    const ul = (e.target as HTMLUListElement).parentElement as HTMLUListElement;
    const scroll = min ? minutesScroll : hoursScroll;
    if (e.deltaY > 0)
      min
        ? scroll.current > -minutes.length + 3
          ? (scroll.current = scroll.current - 1)
          : (scroll.current = 0)
        : scroll.current > -hours.length + 3
        ? (scroll.current = scroll.current - 1)
        : (scroll.current = 0);
    else
      scroll.current < 0
        ? (scroll.current = scroll.current + 1)
        : min
        ? (scroll.current = -minutes.length + 3)
        : (scroll.current = -hours.length + 3);
    ul.style.transform = `translateY(${28 * scroll.current}px)`;
  };

  return (
    <div className={s.timepick}>
      {picker ? (
        <div className={s.picker}>
          <div className={s.pick_items}>
            <div>
              <ul onWheel={listWheeler} style={{ transform: `translateY(${28 * hoursScroll.current}px)` }}>
                {hours.map((i, ind) => (
                  <li key={ind}>{("0" + i).slice(-2)}</li>
                ))}
              </ul>
            </div>
            <span className={s.dd}>:</span>
            <div>
              <ul onWheel={(e) => listWheeler(e, true)} style={{ transform: `translateY(${28 * minutesScroll.current}px)` }}>
                {minutes.map((i, ind) => (
                  <li key={ind}>{("0" + i).slice(-2)}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={() => {
              setPicker(false);
              const currentTime =
                ("0" + hours[-hoursScroll.current + 1]).slice(-2) + ":" + ("0" + minutes[-minutesScroll.current + 1]).slice(-2);
              if (pickedTime !== currentTime) onClick && onClick(currentTime);
            }}
          >
            SAVE
          </button>
        </div>
      ) : (
        <div className={s.time} onClick={() => setPicker(true)}>
          {pickedTime}
        </div>
      )}
    </div>
  );
}

export default TimePick;
