import { useAppSelector } from "../../../store/store";

import s from "./stats.module.scss";
import { useEffect, useRef } from "react";

const w: Window & { Chart?: any } = window;

function Stats() {
  const graphic = useRef<any>(null);
  const statsRef = useRef<HTMLCanvasElement>(null);
  const stats = useAppSelector((s) => s.userSlice.stats);

  useEffect(() => {
    if (statsRef.current) {
      const ctx = statsRef.current.getContext("2d");

      if (graphic.current) graphic.current.destroy();

      graphic.current = new w.Chart(ctx, {
        type: "line",
        data: {
          labels: stats.date,
          datasets: [
            {
              label: "Score",
              data: stats.score,
              borderWidth: 2,
              borderColor: "rgb(255, 150, 12)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              tension: 0.1,
            },
          ],
        },
        options: {
          indexAxis: "x",
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [statsRef.current]);

  return (
    <div className={s.stats}>
      <canvas id="stats" ref={statsRef}></canvas>
    </div>
  );
}

export default Stats;
