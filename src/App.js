import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from "react-table";
import "./App.css";
import fakeData from "./MOCK_DATA.json";
import * as React from "react";

function App() {
  const data = React.useMemo(() => fakeData, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Phone No.",
        accessor: "phone_number",
      },
      {
        Header: "Call Date",
        accessor: "call_date",
      }
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter, // Custom filter UI
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    { columns, data, defaultColumn },
    useFilters, // Use column filters
    useGlobalFilter, // Use global filter
    useSortBy // Use column sorting
  );

  const { globalFilter } = state;

  // Define a custom filter UI component
  function DefaultColumnFilter({ column }) {
    const { filterValue, setFilter } = column;
    const [filterInput, setFilterInput] = React.useState(filterValue);

    const onChange = useAsyncDebounce((value) => {
      setFilter(value || undefined);
    }, 200);

    return (
      <input
        value={filterInput || ""}
        onChange={(e) => {
          setFilterInput(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Filter ${column.Header.toLowerCase()}`}
      />
    );
  }

  return (
    <div className="App">
      <div className="container">
        <div className="global-filter">
          <input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns"
          />
        </div>
        <table {...getTableProps()}>
  <thead>
    {headerGroups.map((headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          <th
            {...column.getHeaderProps(column.getSortByToggleProps())}
            className={`${
              column.isSorted ? (column.isSortedDesc ? "sorted-desc" : "sorted-asc") : ""
            }`}
          >
            {column.render("Header")}
            <span> {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""} </span>
            <div>{column.canFilter ? column.render("Filter") : null}</div>
          </th>
        ))
        }
      </tr>
    ))
    }
  </thead>
  <tbody {...getTableBodyProps()}>
    {rows.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
          ))
          }
        </tr>
      );
    })}
  </tbody>
</table>

      </div>
    </div>
  );
}

export default App;   