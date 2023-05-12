import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import s from "./mess.module.scss";
import { unsetMess } from "../../../store/reducers/messSlice";

function Mess() {
  const mess = useAppSelector((s) => s.messSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!mess.visible) return;
    setTimeout(() => {
      dispatch(unsetMess());
    }, 5000);
  }, [mess]);

  return (
    <div className={`${s.mess} ${mess.visible && s.active}`}>
      <i className={`fa-solid ${mess.status ? `fa-check-circle ${s.check}` : "fa-xmark-circle"}`} />
      {mess.message}
    </div>
  );
}

export default Mess;
