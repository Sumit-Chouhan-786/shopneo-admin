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
  Label,
  Textarea
} from "@windmill/react-ui";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";

Modal.setAppElement("#root"); 

function AddCustomerBlog({ history }) {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const resultsPerPage = 10;

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    whatsappUrl: "",
    description: "",
    image: null,
    agree: false
  });

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await api.get("customer/getcustomer");
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Open modal
const openModal = (customer) => {
  console.log("Selected Customer ID:", customer._id);
  setSelectedCustomer(customer);
  setFormValues({
    heading: "",
    description: "",
    image: null,
    agree: false,
  });
  setShowModal(true);
};


  const closeModal = () => {
    setSelectedCustomer(null);
    setShowModal(false);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormValues({ ...formValues, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormValues({ ...formValues, [name]: checked });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Submit blog form
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formValues.agree) {
    toast.error("⚠️ You must agree to the privacy policy!");
    return;
  }

  const formData = new FormData();
  formData.append("heading", formValues.heading);
  formData.append("description", formValues.description);
  if (formValues.image) formData.append("image", formValues.image);

  try {
    await toast.promise(
      api.post(`blogs/addblog/${selectedCustomer._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      {
        loading: "Adding blog...",
        success: "✅ Blog added successfully!",
        error: "❌ Failed to add Blog",
      }
    );
    closeModal();
  } catch (error) {
    toast.error("Something went wrong!");
    console.error("Add Blog error:", error.response?.data || error.message);
  }
};

  // Filter + Search
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && true) ||
      (filter === "inactive" && false);
    return matchesSearch && matchesFilter;
  });

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
                      src={customer.profileImage.url}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{customer.slug}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell><span className="text-sm">{customer.email || "-"}</span></TableCell>
                <TableCell><span className="text-sm">{customer.contact || "-"}</span></TableCell>
                <TableCell><span className="text-sm">{customer.businessName || "-"}</span></TableCell>
                <TableCell><Badge type="success">Active</Badge></TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    {/* Add blog Button */}
                    <Button layout="outline" size="small" onClick={() => openModal(customer)}>
                      Add Blog
                    </Button>

                    {/* All Blogs Button */}
                    <Button
                      layout="outline"
                      size="small"
                      onClick={() => history.push(`/app/all-customer-blogs/${customer._id}`)}
                    >
                      All Blogs
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

      {/* Modal for Adding Blog */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Add Blog Modal"
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Add blog for {selectedCustomer?.name}</h2>
        <form onSubmit={handleSubmit}>
          <Label className="mt-2">
            <span>Heading</span>
            <Input name="heading" value={formValues.heading} onChange={handleChange} required />
          </Label>
          <Label className="mt-2">
            <span>Description</span>
            <Textarea name="description" value={formValues.description} onChange={handleChange} rows="3" />
          </Label>
          <Label className="mt-2">
            <span>Blog Image</span>
            <Input type="file" name="image" accept="image/*" onChange={handleChange} />
          </Label>
          <Label className="mt-2" check>
            <Input type="checkbox" name="agree" checked={formValues.agree} onChange={handleChange} required />
            <span className="ml-2">I agree to the <span className="underline">privacy policy</span></span>
          </Label>
          <div className="flex justify-end mt-4 space-x-2">
            <Button layout="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit">Add Blog</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default AddCustomerBlog;
