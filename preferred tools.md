# Preferred Tools & Resources
Use these by default whenever applicable to the current project. 

## Mockoon, mock API
Mockoon's playground is a ready-to-use mock API for all your prototyping needs: fake JSON data, JSON placeholders, realistic CRUD API mock, etc. It is also a good way to discover Mockoon's features. The playground offers the resources below, populated with fake data (generated using Faker.js).

You can use this playground for:

Learning and teaching APIs

Quick prototyping

Discovering Mockoon features

☁️ Deploy your own mock APIs in the cloud and share them with your team with Mockoon Cloud
Learn more
Available resources
Companies /companies
100 items
Fake companies JSON data including name, industry, location, number of employees, etc.
{
  "id": "c408c0de-c0ba-40f3-8a4f-f1acb561de03",
  "name": "Botsford Group",
  "industry": "monetize compelling mindshare",
  "location": {
    "city": "South Valley",
    "country": "American Samoa"
  },
  "employees": 23895,
  "is_public": false
}
Contacts /contacts
100 items
Fake contacts JSON data including name, email, phone, complete address, etc.
Customers /customers
100 items
Fake customers JSON data including name, email, phone, address, age, etc.
Movies /movies
100 items
Fake movies JSON data including title, genre, director, release year, rating, etc.
Notifications /notifications
100 items
Fake notifications JSON data including title, message, etc.
Photos /photos
100 items
Fake photos JSON data including URL, caption, likes, etc.
Pokemons /pokemons (read-only)
809 items
List of Pokemons with their name, type, base stats, etc. This dataset is read-only, you can only GET the full list or a single Pokemon by its id (GET /pokemons or GET /pokemons/{id}).
Posts /posts
100 items
Fake blog posts JSON data including title, author, date, content, number of views, etc.
Current time /time
Fake time JSON data including UTC date time, Unix time, milliseconds, day of week, day of month, etc.
Todos /todos
100 items
Fake todos JSON data including title, completion status, priority, due date, etc.
Sales /sales
100 items
Fake sales JSON data including country, item type, unit cost, number of units, etc.
Users /users
100 items
Fake users JSON data including name, email, phone, address, birthdate, etc.

Playground API base URL
https://playground.mockoon.com/

Available routes/methods for each resource (replace {resources} with the resource name on the left, e.g. /contacts):
GET
/{resources}
Returns the entire array
GET
/{resources}/:id
Returns an object by its id property
POST
/{resources}
Inserts a new object in the array (autogenerate the id (UUID) if not provided)
PUT
/{resources}/:id
Performs a full object update by its id (replace)
PATCH
/{resources}/:id
Performs a partial object update by its id (merge)
DELETE
/{resources}/:id
Deletes an object by its id
💡 You can also use the sorting, searching and filtering query parameters on the main GET route, example: ?property_eq=test&page=2&limit=50. You will find more information about the CRUD routes behavior in our documentation.

## Handsontable
Installation
Install Handsontable through your preferred package manager, and control your grid through the HotTable component's props.

On this page
Install Handsontable
Import Handsontable's CSS
Register Handsontable's modules
Use the HotTable component
Preview the result
Related articles
Related guides
Related API reference
Install Handsontable
To install Handsontable locally using a package manager, run one of these commands:

npm
Yarn
pnpm
npm install handsontable @handsontable/react-wrapper

Import Handsontable's CSS
Import Handsontable's CSS into your application.

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

Register Handsontable's modules
Import and register all of Handsontable's modules with a single function call:

import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();

Or, to reduce the size of your JavaScript bundle, import only the modules that you need.

Use the HotTable component
The main Handsontable component is called HotTable.

import { HotTable } from '@handsontable/react-wrapper';

To set Handsontable's configuration options, use HotTable's props. For example:

<HotTable
  themeName="ht-theme-main-dark-auto"
  // other options
  data={[
    ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
    ['2019', 10, 11, 12, 13],
    ['2020', 20, 11, 14, 13],
    ['2021', 30, 15, 12, 13]
  ]}
  rowHeaders={true}
  colHeaders={true}
  height="auto"
  autoWrapRow={true}
  autoWrapCol={true}
  licenseKey="non-commercial-and-evaluation" // for non-commercial use only
/>

@handsontable/react-wrapper requires at least React@18 and is built with functional editors and renderers components in mind. If you use a lower version of React or prefer to use class-based components, you can use the @handsontable/react package instead.

For more information on @handsontable/react, see the 14.6 documentation (opens new window).

Preview the result
Tesla   Volvo   Toyota  Ford
2019    10  11  12  13
2020    20  11  14  13
2021    30  15  12  13
 
A
B
C
D
E
1
2
3
4
 

Source code




Related articles
Related guides
Modules
Related API reference
Configuration options:
maxCols
maxRows
minCols
minRows
minSpareCols
minSpareRows
startCols
startRows
Hooks:
afterInit
beforeInit
beforeInitWalkontable
construct

<script type="module"> import handsontable from https://cdn.jsdelivr.net/npm/handsontable@16.0.1/+esm </script>
Configuration options
Configure your grid down to each column, row, and cell, using various built-in options that control Handsontable's behavior and user interface.

On this page
Overview
Cascading configuration
Plugin options
Set grid options
Set column options
Set row options
Set cell options
Read cell options
Change cell options
Implement custom logic
Configuration example
Related API reference
Overview
To apply configuration options, pass them as individual props of the HotTable or HotColumn components.

<HotTable
  autoWrapRow={true}
  autoWrapCol={true}
  licenseKey="non-commercial-and-evaluation"
  data={[
    ['A1', 'B1', 'C1', 'D1'],
    ['A2', 'B2', 'C2', 'D2'],
    ['A3', 'B3', 'C3', 'D3'],
  ]}
  width={400}
  height={300}
  colHeaders={true}
  rowHeaders={true}
  customBorders={true}
  dropdownMenu={true}
  multiColumnSorting={true}
  filters={true}
  manualRowMove={true}
/>

Depending on your needs, you can apply configuration options to different elements of your grid, such as:

The entire grid
Individual columns
Individual rows
Individual cells
Individual grid elements, based on any logic you implement
For the full list of available configuration options, see the configuration options' API reference.

Cascading configuration
Handsontable's configuration cascades down:

From the top-level grid options (GlobalMeta (opens new window))
Through the mid-level column options (ColumnMeta (opens new window))
To the bottom-level cell options (CellMeta (opens new window))
When you modify the mid-level column options (using the columns option):

The options that you change overwrite the top-level grid options.
The options that you change cascade down to the bottom-level cell options.
Any unchanged options are inherited from the top-level grid options.
When you modify the bottom-level cell options (using the cell option):

The options that you change overwrite the top-level grid options.
The options that you change overwrite the mid-level column options.
Any unchanged options are inherited from the mid-level column options or the top-level grid options.
When you modify any options with the cells function, the changes overwrite all other options.

The cells option is a function invoked before Handsontable's rendering cycle. Implemented incorrectly, it can slow Handsontable down. Use the cells option only if the cell option, the columns option, and the setCellMeta() method don't meet your needs.

For more details on Handsontable's cascading configuration, see the MetaManager class (opens new window).

Plugin options
Configuration options can come from:

Handsontable's Core
Handsontable's plugins
Handsontable's hooks
If you use Handsontable through modules: to use an option that comes from a Handsontable plugin, you need to import and register that plugin when initializing your Handsontable instance.

To find out if an option comes from a plugin, check the Category label in the configuration options' API reference.

Set grid options
To apply configuration options to the entire grid, pass your options as individual props of the HotTable or HotColumn components.

For example, to set the entire grid's width and height:

<HotTable width={400} height={300} />

Example
To configure each cell in the grid as read-only, apply the readOnly option as a top-level grid option.

The top-level grid options cascade down:

To the mid-level column options
To the bottom-level cell options
As a result, each cell in the grid is read-only:

A1  B1  C1  D1  E1  F1  G1  H1  I1  J1
A2  B2  C2  D2  E2  F2  G2  H2  I2  J2
A3  B3  C3  D3  E3  F3  G3  H3  I3  J3
A4  B4  C4  D4  E4  F4  G4  H4  I4  J4
A5  B5  C5  D5  E5  F5  G5  H5  I5  J5
 
A
B
C
D
E
F
G
H
I
J
1
2
3
4
5
 

Source code




Set column options
To apply configuration options to an individual column (or a range of columns), use the columns option.

<HotTable
  columns={[
    {width: 100}, // column options for the first (by physical index) column
    {width: 100}, // column options for the second (by physical index) column
    {width: 100}, // column options for the third (by physical index) column
  ]}
/>

Alternatively, you can use the HotColumn component to configure columns declaratively:

<HotTable>
  <HotColumn width={100}/>
  <HotColumn width={100}/>
  <HotColumn width={100}/>
</HotTable>

Example
In the example below, the columns option is set to a function.

The function applies the readOnly: true option to each column that has a physical index of either 2 or 8.

The modified mid-level column options:

Overwrite the top-level grid options
Cascade down to the bottom-level cell options
As a result, each cell in the third and ninth columns is read-only:

A1  B1  C1  D1  E1  F1  G1  H1  I1  J1
A2  B2  C2  D2  E2  F2  G2  H2  I2  J2
A3  B3  C3  D3  E3  F3  G3  H3  I3  J3
A4  B4  C4  D4  E4  F4  G4  H4  I4  J4
A5  B5  C5  D5  E5  F5  G5  H5  I5  J5
 
A
B
C
D
E
F
G
H
I
J
1
2
3
4
5
 

Source code




Set row options
To apply configuration options to an individual row (or a range of rows), use the cells option.

Any options modified through cells overwrite all other options.

The function can take three arguments:

row: a row coordinate (a physical index)
col: a column coordinate (a physical index)
prop: if your data is an array of objects, prop is a property name for a column's data source object.
If your data is an array of arrays, prop is the same as col.
<HotTable cells={(row, col, prop) => {
  if (row === 1 || row === 4) {
    return {
      // row options, which apply to each cell of the second row
      // and to each cell of the fifth row
      readOnly: true,
    };
  }
}}/>

Example
In the example below, the cells option sets each cell in the first and fourth row as readOnly.

Options modified through cells overwrite all other options.

A1  B1  C1  D1  E1  F1  G1  H1  I1  J1
A2  B2  C2  D2  E2  F2  G2  H2  I2  J2
A3  B3  C3  D3  E3  F3  G3  H3  I3  J3
A4  B4  C4  D4  E4  F4  G4  H4  I4  J4
A5  B5  C5  D5  E5  F5  G5  H5  I5  J5
 
A
B
C
D
E
F
G
H
I
J
1
2
3
4
5
 

Source code




Set cell options
To apply configuration options to individual cells, use the cell option.

<HotTable cell={[
  { // bottom-level cell options overwrite the top-level grid options
    // apply only to a cell with coordinates (0, 0)
    row: 0,
    col: 0,
  },
  {
    // bottom-level cell options overwrite the top-level grid options
    // apply only to a cell with coordinates (1, 1)
    row: 1,
    col: 1,
  }
]}/>

Example
In the example below, the cell option sets cell A1(0, 0) and cell B2(1, 1) as readOnly.

The modified cell options:

Overwrite the top-level grid options
Overwrite mid-level column options
A1  B1  C1  D1  E1  F1  G1  H1  I1  J1
A2  B2  C2  D2  E2  F2  G2  H2  I2  J2
A3  B3  C3  D3  E3  F3  G3  H3  I3  J3
A4  B4  C4  D4  E4  F4  G4  H4  I4  J4
A5  B5  C5  D5  E5  F5  G5  H5  I5  J5
 
A
B
C
D
E
F
G
H
I
J
1
2
3
4
5
 

Source code




Read cell options
When Handsontable is running, you can check a cell's current options, using the getCellMeta() method.

The getCellMeta() method returns an object with:

All built-in options (stored in the CellMeta (opens new window)prototype (opens new window))
Any options you add
For example:

// Consider the HotTable component with the `cell` option declared:
<HotTable
  cell={[
    {
      row: 1,
      col: 1,
      readOnly: true,
    }
  ]}
/>;

// for cell (0, 0), the `readOnly` option is the default (`false`)
// returns `false`
hot.getCellMeta(0, 0).readOnly;

// for cell (1, 1), the `cell` option overwrote the default `readOnly` value
// returns `true`
hot.getCellMeta(1, 1).readOnly;

Change cell options
When Handsontable is running, you can change the initial cell options, using the setCellMeta() method.

For example:

// changes the `readOnly` option of cell (1, 1) back to `false`
hot.setCellMeta(1, 1, 'readOnly', false);

// returns `false`
hot.getCellMeta(1, 1).readOnly;

Implement custom logic
You can apply configuration options to individual grid elements (columns, rows, cells), based on any logic you implement, using the cells option.

The cells option overwrites all other options.

The function can take three arguments:

row: a row coordinate (a physical index)
col: a column coordinate (a physical index)
prop: if your data is an array of objects, prop is a property name for a column's data source object.
If your data is an array of arrays, prop is the same as col.
<HotTable
  cells={(row, col) => {
    if ((row === 1 || row === 5) && col === 1) {
      return {
        readOnly: true,
      };
    }
  }}
/>

Example
In the example below, the modified cells options overwrite the top-level grid options.

// for cell (0, 0), the `readOnly` option is the default (`false`)
// returns `false`
hot.getCellMeta(0, 0).readOnly;

// for cell (1, 1), the `cell` option overwrote the default `readOnly` value
// returns `true`
hot.getCellMeta(1, 1).readOnly;

// changes the `readOnly` option of cell (1, 1) back to `false`
hot.setCellMeta(1, 1, 'readOnly', false);

// returns `false`
hot.getCellMeta(1, 1).readOnly;

Configuration example
In the example below, some cells are read-only, and some cells are editable:

By default, all cells are read-only (as set in the top-level grid options).
For the first column, the mid-level column options overwrite the top-level grid options.
As a result, the first column cells are editable.
For cell A1 (0, 0), the bottom-level cell options overwrite both the mid-level column options, and the top-level grid options.
As a result, cell A1 (0, 0) is read-only, despite being part of the editable first column.
For cell C3 (3, 3), the cells option overwrites all other options.
As a result, cell C3 (3, 3) is editable, despite not being part of the editable first column.
A1  B1  C1  D1  E1  F1  G1  H1  I1  J1
A2  B2  C2  D2  E2  F2  G2  H2  I2  J2
A3  B3  C3  D3  E3  F3  G3  H3  I3  J3
A4  B4  C4  D4  E4  F4  G4  H4  I4  J4
A5  B5  C5  D5  E5  F5  G5  H5  I5  J5
 
A
B
C
D
E
F
G
H
I
J
1
2
3
4
5
 

Source code




Related API reference
Configuration options:
List of all options
cell
cells
columns
Core methods:
getCellMeta()
getCellMetaAtRow()
getCellsMeta()
setCellMeta()
setCellMetaObject()
removeCellMeta()
getSettings()
removeCellMeta()
updateSettings()
spliceCellsMeta()
Hooks:
afterCellMetaReset
afterUpdateSettings

