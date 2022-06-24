import styles from "@ui/Button/styles.module.scss";
import type { JSX } from "solid-js/jsx-runtime";

type Props = {
  children: JSX.Element;
};

function Button(props: Props) {
  return <button class={styles.test}>{props.children}</button>;
}

export default Button;
