import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import "./App.css";
import fakeData from "./MOCK_DATA.json";

function App() {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const data = React.useMemo(() => fakeData, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ row }) => {
          const isSelected = selectedRows.has(row.id);

          const toggleRowSelection = () => {
            if (isSelected) {
              selectedRows.delete(row.id);
            } else {
              selectedRows.add(row.id);
            }
            setSelectedRows(new Set(selectedRows));
          };

          return (
            <div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={toggleRowSelection}
              />
              {row.values.customer}
            </div>
          );
        },
      },
      { Header: "Last Seen", accessor: "lastSeen" },
      { Header: "No. of Orders", accessor: "orders" },
      { Header: "Total Spent", accessor: "totalSpent" },
      { Header: "Latest Purchase", accessor: "latestPurchase" },
      { Header: "News.", accessor: "news" },
      { Header: "Segments", accessor: "segments" },
    ],
    [selectedRows]
  );
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter, // Custom filter UI
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter} = useTable({ columns, data, defaultColumn }, useFilters,  useGlobalFilter, useSortBy );

  const { globalFilter } = state;

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
      const isSelected = selectedRows.has(row.id);
      return (
        <tr {...row.getRowProps()}
        className={isSelected ? 'selected-row' : ''}
        >
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