import Theme from "./Items/Theme";
import Schedule from "./Items/Schedule";
import Freetime from "./Items/Freetime";
import s from "./general.module.scss";
import Reasons from "./Items/Reasons";

function General() {
  return (
    <div className={s.general}>
      <Theme />
      <Schedule />
      <Freetime />
      <Reasons />
    </div>
  );
}

export default General;
