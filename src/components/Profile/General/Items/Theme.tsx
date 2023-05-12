import { useState, useEffect } from "react";
import s from "../general.module.scss";

function Theme() {
  const localTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(localTheme ? localTheme === "true" : false);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <div className={s.item}>
      <span>Light theme</span>
      <input type="checkbox" className={s.switch} checked={theme} onChange={(e) => setTheme(e.target.checked)} />
    </div>
  );
}

export default Theme;
