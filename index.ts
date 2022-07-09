import Button from "@ui/Button";
import Input from "@ui/Input";
import locale from "@ui/locale";
import Select from "@ui/Select";
import "@fontsource/ubuntu";
// eslint-disable-next-line no-restricted-imports
import "./index.css";

// Infer locale from html lang attribute
if (globalThis?.document?.querySelector) {
  const { lang } = globalThis.document.querySelector("html") || {};
  locale.locale = lang;
}

export { Button, Input, Select };
