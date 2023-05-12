import { cloneElement, useState } from "react";
import Input from "./Input";

export type fields = { [key: string]: string };

interface IProps {
  className?: string;
  children?: JSX.Element;
  checkout?: { [key: string]: (v: string) => string };
  fields?: fields;
}

const Form: React.FunctionComponent<IProps> = (props) => {
  const [errors, setErrors] = useState<{ [key: string]: string }[]>([]);
  const fields: fields = props.fields ? props.fields : {};
  let elemId = 0;
  function builder(elem: JSX.Element): JSX.Element {
    if (typeof elem === "string") return elem;
    if (elem.type === "input")
      return (
        <Input
          props={{
            name: elem.props.name,
            props: { ...elem.props },
            fields,
            error: errors.find((i) => i[elem.props.name]) !== undefined ? errors.find((i) => i[elem.props.name]) : "",
          }}
          key={elem.props.name}
        />
      );
    if (elem.type === "button")
      return cloneElement(
        elem,
        {
          key: elem.props.key + elemId,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            const errors: { [key: string]: string }[] = Object.keys(fields).map((i) => {
              return props.checkout ? (props.checkout[i] ? { [i]: props.checkout[i](fields[i]) } : { [i]: "" }) : { "": "" };
            });
            setErrors(errors);
            if (errors.map((i) => Object.values(i)[0]).every((v) => v === "")) elem.props.onClick && elem.props.onClick(e, fields);
          },
        },
        elem.props.children
      );
    if (elem.type === "img") return elem;

    elemId++;
    return cloneElement(
      elem,
      { key: elemId },
      elem.props.children
        ? Array.isArray(elem.props.children)
          ? elem.props.children.map((i: JSX.Element) => builder(i))
          : typeof elem.props.children === "string"
          ? elem.props.children
          : builder(elem.props.children)
        : []
    );
  }
  return <form className={props.className}>{props.children && builder(props.children)}</form>;
};

export default Form;
