const counter = incrementer();
counter.next(0);

class RpgTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.addEventListener("click", event => {
      console.log(event.target);
    })
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const roll = this.getAttribute("roll");
    const container = createElement("div", {class: "rpg-table"});
    container.append(createElement("div",{class: "rpg-table-head"},`Roll${roll ? ` (${roll})`:""}`), createElement("div",{class: "rpg-table-head"}, "Result"), createElement("slot"));
    const style = createElement("style",{}, `
    .rpg-table {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 0.5rem;
    }

    .rpg-table-head {
      text-align: center;
      font-weight: bold;
    }

    ::slotted(rpg-table-entry) {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      align-items: center;
    }
    `);
    shadow.append(container,style);
  }
}

class RpgTableEntry extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const weight = parseInt(this.getAttribute("weight")) || 1;
    const end = counter.next(weight).value;
    const shadow = this.shadowRoot;
    const roll = createElement(
      "div",
      {class: "rpg-table-entry-roll"},
      `${weight > 1 ? (end - weight + 1) + "–" : ""}${end}`);
    const slot = createElement("div",{},createElement("slot"));
    const style = createElement("style",{}, `
    .rpg-table-entry-roll {
      text-align: center;
    }
    * {
      cursor: pointer;
    }
    `)
    shadow.append(roll, slot, style);
    this.addEventListener("mouseenter", () => {
      this.setAttribute("style","background-color: lightgray");
    });
    this.addEventListener("mouseleave", () => {
      this.setAttribute("style","")
    })
  }
}


customElements.define("rpg-table", RpgTable);
customElements.define("rpg-table-entry", RpgTableEntry);



/**
 * Creates a new HTML element and returns it.
 * @param {string} type The type of HTML element to create.
 * @param {object} props An object where each key is an attribute to be set on the element at the given value.
 * @param  {...HTMLElement | string} children HTML elements and text nodes to be appended as children of the element.
 * @returns {HTMLElement} The new element.
 */
function createElement(type, props, ...children) {
  const element = document.createElement(type);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      element.setAttribute(key, value);
    }
  }
  element.append(...children);
  return element;
}


function* incrementer() {
  let total = 0;
  while (true) {
    const addition = yield total;
    if (addition != null) {
      total += addition
    } else {
      total++
    }
  }
}
