const counter = incrementer();
counter.next(0);

class RpgTable extends HTMLElement {
  /**
   * @event RpgTable#rpgtableselect
   * @type {CustomEvent}
   * @property {HTMLElement} detail
   */

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.addEventListener("selectrpgtable", event => {
      event.stopPropagation();
      this.select();
    });
    this.addEventListener("clearrpgtable", event => {
      event.stopPropagation();
      this.clear(event);
    })
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const roll = this.getAttribute("roll");
    const compact = this.getAttributeNames().includes("compact") && this.getAttribute("compact") != "false";
    const container = createElement("div", { part: "table" });
    const headRoll = createElement("div", { part: "head" }, `Roll${roll ? ` (${roll})`:""}`);
    if (!compact) {
      container.append(headRoll);
      headRoll.addEventListener("click", () => this.select());
    }
    const result = createElement("div", { part: "head" }, "Result");
    result.addEventListener("click", () => this.select());
    container.append(result, createElement("slot"));
    const style = createElement("style",{}, `
    ::part(table) {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 0.5rem;
      cursor: pointer;
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

  /**
   * Clears the table.
   * @param {Event} event The triggering event.
   */
  clear(event) {
    event.target.classList.remove("highlight");
    this.querySelectorAll("rpg-table-entry").forEach(entry => entry.classList.remove("gray-out"));
  }

  /**
   * Randomly selects a table entry.
   * @fires RpgTable#rpgtableselect
   */
  select() {
    let totalWeight = 0;
    const entries = [...this.querySelectorAll("rpg-table-entry")].map(entry => {
      let weight = parseInt(entry.getAttribute("weight")) || 1;
      totalWeight += weight;
      return { element: entry, weight, ceiling: totalWeight }
    });
    const randomSelect = Math.floor(Math.random() * totalWeight);
    const selectedEntry = entries.find(row => row.ceiling > randomSelect).element;
    entries.forEach(entry => {
      if (entry.element == selectedEntry) {
        entry.element.classList.remove("gray-out");
        entry.element.classList.add("highlight");
      } else {
        entry.element.classList.remove("highlight");
        entry.element.classList.add("gray-out");
      }
    });
    this.dispatchEvent(new CustomEvent("rpgtableselect", {
      bubbles: true, 
      detail: this.querySelector(".highlight")
    }));

  }
}

class RpgTableEntry extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.addEventListener("click", () => {
      if (this.classList.contains("highlight"))
        this.dispatchEvent(new Event("clearrpgtable", { bubbles: true }));
      else
        this.dispatchEvent(new Event("selectrpgtable", { bubbles: true }));
    });
  }

  connectedCallback() {
    const compact = this.parentElement.getAttributeNames().includes("compact") && this.parentElement.getAttribute("compact") != "false";
    const rollValue = this.getAttribute("roll");
    const weight = parseInt(this.getAttribute("weight")) || 1;
    const end = counter.next(weight).value;
    const shadow = this.shadowRoot;
    const roll = createElement("div", { part: "roll" },
      `${rollValue ? rollValue : ((weight > 1 ? (end - weight + 1) + "–" : "") + end)}`);
    if (!compact) {
      shadow.append(roll);
    }
    const slot = createElement("div",{part: "result"},createElement("slot"));
    shadow.append(slot);
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

/**
 * Increments a value.
 * @returns {Generator}
 */
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
