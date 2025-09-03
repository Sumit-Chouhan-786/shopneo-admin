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

function AllSellers({ history }) {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, verified, unverified

  const resultsPerPage = 10;

  // Fetch all sellers
  const fetchSellers = async () => {
    try {
      const res = await api.get("seller/getsellers");
      setSellers(res.data.sellers || []);
    } catch (error) {
      console.error(
        "Error fetching sellers:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Delete seller
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      try {
        await api.delete(`seller/deleteseller/${id}`);
        fetchSellers(); // refresh list
      } catch (error) {
        console.error(
          "Error deleting seller:",
          error.response?.data || error.message
        );
      }
    }
  };

  // Redirect to update page
  const handleEdit = (id) => {
    history.push(`/app/update-seller/${id}`);
  };

  // Filter + Search logic
  const filteredSellers = sellers.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.slug?.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && s.verified) ||
      (filter === "unverified" && !s.verified);

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalResults = filteredSellers.length;
  const paginatedData = filteredSellers.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <>
      <PageTitle>Sellers</PageTitle>
      <SectionTitle>All Sellers</SectionTitle>

      {/* Search & Filter */}
      <div className="flex items-center mb-4 space-x-4">
        <Input
          placeholder="Search by name, slug, tagline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </Select>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Seller</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Tagline</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>

          <TableBody>
            {paginatedData.map((seller, i) => (
              <TableRow key={seller._id || i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={seller.logo || "https://via.placeholder.com/40"}
                      alt="Seller Logo"
                    />
                    <div>
                      <p className="font-semibold">{seller.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{seller.slug || "-"}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{seller.tagline || "-"}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">
                    {seller.category?.join(", ") || "-"}
                  </span>
                </TableCell>

                <TableCell>
                  {seller.verified ? (
                    <Badge type="success">Verified</Badge>
                  ) : (
                    <Badge type="danger">Unverified</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => handleEdit(seller._id)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>

                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => handleDelete(seller._id)}
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

export default AllSellers;
