import React, { useState, useEffect } from "react";
import PageTitle from "../Typography/PageTitle";
import SectionTitle from "../Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Input,
  Select,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../../icons";
import api from "../../api/axios";

function AllCustomers({ history }) {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive

  const resultsPerPage = 10;

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await api.get("customer/getcustomer");
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error(
        "Error fetching customers:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`customer/deletecustomer/${id}`);
        fetchCustomers(); // refresh list
      } catch (error) {
        console.error(
          "Error deleting customer:",
          error.response?.data || error.message
        );
      }
    }
  };

  // Redirect to update page
  const handleEdit = (id) => {
    history.push(`/app/update-customer/${id}`);
  };

  // Filter + Search logic
  const filteredCustomers = customers.filter((c) => {
    // Search (name, email, businessName)
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName?.toLowerCase().includes(search.toLowerCase());

    // Status filter (dummy: assuming all are "active" for now)
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && true) || // you can replace `true` with c.isActive check
      (filter === "inactive" && false);

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalResults = filteredCustomers.length;
  const paginatedData = filteredCustomers.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <>
      <PageTitle>Customers</PageTitle>
      <SectionTitle>All Customers</SectionTitle>

      {/* Search & Filter */}
      <div className="flex items-center mb-4 space-x-4">
        <Input
          placeholder="Search by name, email, business..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>

          <TableBody>
            {paginatedData.map((customer, i) => (
              <TableRow key={customer._id || i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                 <Avatar
  className="hidden mr-3 md:block"
  src={customer?.profileImage?.url || "../../assets/img/logo.webp"}
  alt="User avatar"
/>

                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {customer.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{customer.email || "-"}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{customer.contact || "-"}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">
                    {customer.businessName || "-"}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge type="success">Active</Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => handleEdit(customer._id)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>

                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => handleDelete(customer._id)}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default AllCustomers;
