# rpg-table
A web component for adding tables that highlight a randomly selected entry on
a click, for RPG pages.

## Installing
Include a `script` element in your page with a `src` attribute pointing to
`rpg-tables.js` on your site. Anywhere you want to include a random table, use
the `<rpg-table>` element with two or more `<rpg-table-entry>` child elements.

## Functionality
Clicking on a selected entry will clear the selection and reset the table.
Clicking anywhere else on the table will trigger a new random selection.

On each random selection, the table fires a `rpgtableselect` [CustomEvent]
with a `detail` value of the selected `<rpg-table-entry>` element.

## \<rpg-table\>
The `<rpg-table>` element defines a random table. It takes two optional attributes:

- `compact`: Boolean. If true, will omit the Roll column and show only the
  Results. Default: false.
- `roll`: A string indicating the dice to use when manually rolling the table.
  Included in parenthesis in the head of the Roll column. No effect if combined
  with `compact`.

## \<rpg-table-entry\>
The `<rpg-table-entry>` element defines an entry in the random table. It can
include any flow content as children. It takes two optional attributes: 

- `roll`: A string defining the range of rolls that produce the result. Should
  be used for all entries or none, and should accompany `weight`. Parent table
  should also use `roll` to indicate the dice used.
- `weight`: An integer defining how heavily the entry should be weighted in the 
  random selection. Default: 1.

## Styling
`<rpg-table>` and `<rpg-table-entry>` shoud be styled first by selecting the
elements themselves, then by the classes applied to selected and non-selected
entries, and finally through the `::part()` [pseudo-element].

Selecting `<rpg-table>` will style the entire table. Use this for table-wide typography as well as sizing, positioning, and decorating the table as a whole.

Selecting `<rpg-table-element>` styles each row. Use this mainly for margins and
borders between entries.

The selected element receives a `highlight` class, while the other elements receive a `gray-out` class. Use these to differentiate the selected entry.

The following parts are defined in the components. In `<rpg-table>`:

- `head`: The header cells ("Roll" and "Result").

In `<rpg-table-entry>`:

- `roll`: The Roll column.
- `result`: The Result column.


[CustomEvent]: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
[pseudo-element]: https://developer.mozilla.org/en-US/docs/Web/CSS/::part