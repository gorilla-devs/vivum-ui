/* @refresh reload */
import { render } from "solid-js/web";
import Button from "@ui/Button";
import Input from "@ui/Input";
import "@fontsource/ubuntu";
// eslint-disable-next-line no-restricted-imports
import "../index.css";
import Select from "@ui/Select";

const options = new Array(300).fill(0).map((v, i) => `Number ${i}`);

const Demo = () => (
  <div>
    <Button>{"Button"}</Button>
    <Input />
    <Select options={options} />
  </div>
);

render(() => <Demo />, document.getElementById("root"));
