import fuzzysort from "fuzzysort";
import {
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  Switch,
} from "solid-js";

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
  let selectedItem: HTMLOptionElement;

  const closeListBox = () => {
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
            listboxRef.classList.add("bottom-full");
            listboxRef.classList.add("top-auto");
            listboxRef.classList.remove("top-full");
            listboxRef.classList.remove("bottom-auto");
          } else {
            listboxRef.classList.remove("bottom-full");
            listboxRef.classList.remove("top-auto");
            listboxRef.classList.add("top-full");
            listboxRef.classList.add("bottom-auto");
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
    <div
      class="top-auto font-main relative block outline outline-offset-2 outline-blue-500 bg-white w-max min-w-fit select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setVisible(!visible());
          if (!visible()) {
            closeListBox();
          } else if (globalThis.document.querySelector) {
            searchInputRef.focus();
            searchInputRef.value = "";
            setFilteredItems(props.options);
            const selected = selectedItem;

            if (selected) {
              listboxScrollRef.scrollTop =
                selected.offsetTop - listboxScrollRef.offsetTop;
            }
          }
        }}
      >
        <div class="flex justify-between items-center h-8 w-60 px-2">
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
      <div
        ref={listboxTriggerRef}
        class="absolute h-px bottom-0 right-0 left-0 top-72"
      />
      <div
        ref={listboxRef}
        class="absolute bg-white w-full top-full bottom-auto mt-2 p-4 drop-shadow-md"
        classList={{
          block: visible(),
          hidden: !visible(),
        }}
      >
        <input
          class="p-1 w-full mb-4"
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
            <div ref={listboxScrollRef} class="max-h-48 overflow-auto">
              <div>
                <For each={filteredItems()}>
                  {(option, index) => {
                    let ref: HTMLOptionElement;
                    createEffect(() => {
                      if (selectedItemIndex() === index()) {
                        selectedItem = ref;
                      }
                    });

                    return (
                      <option
                        ref={ref}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedItemIndex(index);
                          closeListBox();
                        }}
                        class="px-2 mr-1 rounded h-8 flex items-center"
                        classList={{
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          "bg-black bg-opacity-20":
                            selectedItemIndex() === index(),
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          "hover:bg-black hover:bg-opacity-10":
                            selectedItemIndex() !== index(),
                        }}
                      >
                        {option}
                      </option>
                    );
                  }}
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
