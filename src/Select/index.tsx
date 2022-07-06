import fuzzysort from "fuzzysort";
import {
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  Switch,
} from "solid-js";
import style from "@ui/Select/style.module.scss";

// TODO: Allow lazily loaded options with potentially prefilled defaults.
export interface Props {
  options: Array<string>;
}

function Select(props: Props) {
  const [visible, setVisible] = createSignal(false);
  const [selectedItemIndex, setSelectedItemIndex] = createSignal(120);
  const [filteredItems, setFilteredItems] = createSignal<Array<string>>(
    // eslint-disable-next-line solid/reactivity
    props.options
  );
  let listboxRef: HTMLDivElement;
  let listboxTriggerRef: HTMLDivElement;
  let listboxScrollRef: HTMLDivElement;
  let searchInputRef: HTMLInputElement;

  const closeListBox = () => {
    listboxScrollRef.scrollTo(0, 0);
    setVisible(false);
  };
  createEffect(() => {
    if (globalThis.addEventListener && visible()) {
      globalThis.addEventListener("click", closeListBox);
      onCleanup(() => globalThis.removeEventListener("click", closeListBox));
    }
  });

  createEffect(() => {
    if (globalThis.addEventListener) {
      const callbackScroll = (entries: Array<IntersectionObserverEntry>) => {
        entries.forEach((entry) => {
          const isPartiallyOutsideView = entry.intersectionRatio !== 1;

          if (isPartiallyOutsideView) {
            listboxRef.classList.add(style.expandUp);
          } else {
            listboxRef.classList.remove(style.expandUp);
          }
        });
      };

      const observer = new IntersectionObserver(callbackScroll, {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      });
      observer.observe(listboxTriggerRef);

      onCleanup(() => {
        observer.unobserve(listboxTriggerRef);
      });
    }
  });

  return (
    <div class={style.selectmenu} onClick={(e) => e.stopPropagation()}>
      <div
        class={style.button}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(!visible());
          if (!visible()) {
            closeListBox();
          } else if (globalThis.document.querySelector) {
            searchInputRef.focus();
            searchInputRef.value = "";
            setFilteredItems(props.options);
            const selected: HTMLElement | null =
              globalThis.document.querySelector(
                `.${style.listboxScroll} .${style.selectedItem}`
              );

            if (selected) {
              listboxScrollRef.scrollTop =
                selected.offsetTop - listboxScrollRef.offsetTop;
            }
          }
        }}
      >
        <div class={style.selectedValue}>
          <Switch>
            <Match when={selectedItemIndex() === -1}>
              {"Select an option"}
            </Match>
            <Match when={selectedItemIndex() !== -1}>
              {props.options[selectedItemIndex()]}
            </Match>
          </Switch>
          <Switch>
            <Match when={visible()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414Z"
                  clip-rule="evenodd"
                />
              </svg>
            </Match>
            <Match when={!visible()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414Z"
                  clip-rule="evenodd"
                />
              </svg>
            </Match>
          </Switch>
        </div>
      </div>
      <div ref={listboxTriggerRef} class={style.listboxTrigger} />
      <div
        ref={listboxRef}
        class={style.listbox}
        classList={{
          [style.showListbox]: visible(),
        }}
      >
        <input
          class={style.filterInput}
          onClick={(e) => e.stopPropagation()}
          ref={searchInputRef}
          onInput={(e) => {
            setFilteredItems(
              fuzzysort
                .go((e.target as HTMLInputElement).value, props.options, {
                  all: true,
                })
                .map((v) => v.target)
            );
          }}
          placeholder="Search..."
        />
        <Switch>
          <Match when={filteredItems().length > 0}>
            <div ref={listboxScrollRef} class={style.listboxScroll}>
              <div class={style.optionGroup}>
                <For each={filteredItems()}>
                  {(option, index) => (
                    <option
                      class={style.option}
                      classList={{
                        [style.selectedItem]: selectedItemIndex() === index(),
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedItemIndex(index);
                        closeListBox();
                      }}
                    >
                      {option}
                    </option>
                  )}
                </For>
              </div>
            </div>
          </Match>
          <Match when={filteredItems().length === 0}>{"No result found"}</Match>
        </Switch>
      </div>
    </div>
  );
}

export default Select;
