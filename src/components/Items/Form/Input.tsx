import { useEffect, useState } from "react";
import type { fields } from "./Form";

interface IProps {
  props: {
    name: string;
    props: React.InputHTMLAttributes<HTMLInputElement>;
    fields: fields;
    error: { [key: string]: string } | "" | undefined;
  };
}

function Input({ props }: IProps) {
  const [value, setValue] = useState(props.fields[props.name] ? props.fields[props.name] : "");
  const [visible, setVisible] = useState(false);
  const error = props.error !== "" && props.error !== undefined ? Object.values(props.error)[0] : "";

  useEffect(() => {
    props.fields[props.name] = value;
  }, [value, props.fields]);

  delete props.props.name;
  return (
    <div>
      <input
        {...props.props}
        type={props.props.type === "password" ? (visible ? "text" : "password") : props.props.type}
        value={value}
        onChange={(e) => {
          props.props.onChange && props.props.onChange(e);
          props.props.type === "checkbox" ? (e.target.checked ? setValue("1") : setValue("")) : setValue(e.target.value);
        }}
      />
      {props.props.type === "password" && (
        <i className={`fa-solid fa-eye${visible ? "" : "-slash"}`} onClick={() => setVisible((i) => !i)} />
      )}
      <span>{error}</span>
    </div>
  );
}

export default Input;
