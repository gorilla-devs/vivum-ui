/* @refresh reload */
import { render } from "solid-js/web";
import Button from "@ui/Button";
import Input from "@ui/Input";

const Demo = () => (
  <div>
    <Button>{"Button"}</Button>
    <Input />
  </div>
);

render(() => <Demo />, document.getElementById("root"));
