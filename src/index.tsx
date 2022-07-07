/* @refresh reload */
import { render } from "solid-js/web";
import Button from "@ui/Button";
import Input from "@ui/Input";
import "@fontsource/ubuntu";
// eslint-disable-next-line no-restricted-imports
import "../index.css";

const Demo = () => (
  <div>
    <Button>{"Button"}</Button>
    <Input />
  </div>
);

render(() => <Demo />, document.getElementById("root"));
