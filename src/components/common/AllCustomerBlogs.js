import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
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
  Label,
  Textarea
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../../icons";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AllCustomerBlogs() {
  const { customerId } = useParams();
  const history = useHistory();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    heading: "",
    description: "",
    image: null
  });
  const [loading, setLoading] = useState(false);

  const resultsPerPage = 10;

  // Fetch all blogs for this customer
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs/allBlogs/${customerId}`);
      setBlogs(res.data.blogs || []);
      toast.success("Blogs loaded successfully!");
    } catch (error) {
      console.error("Error fetching blogs:", error.response?.data || error.message);
      toast.error("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [customerId]);

  // Open modal to edit blog
  const openModal = (blog) => {
    setSelectedBlog(blog);
    setFormValues({
      heading: blog.heading || "",
      description: blog.description || "",
      image: null
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setShowModal(false);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Submit edit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlog) return;

    const formData = new FormData();
    formData.append("heading", formValues.heading);
    formData.append("description", formValues.description);
    formData.append("customerId", customerId);
    if (formValues.image) formData.append("image", formValues.image);

    try {
      const response = await toast.promise(
        api.put(`/blogs/updateBlog/${selectedBlog._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }),
        {
          loading: "Updating blog...",
          success: "✅ Blog updated successfully!",
          error: "❌ Failed to update blog"
        }
      );

      if (response?.data) {
        closeModal();
        fetchBlogs();
      }
    } catch (error) {
      console.error("Update blog error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await toast.promise(
        api.delete(`/blogs/deleteBlog/${id}`),
        {
          loading: "Deleting blog...",
          success: "✅ Blog deleted successfully!",
          error: "❌ Failed to delete blog"
        }
      );
      fetchBlogs();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Delete blog error:", error.response?.data || error.message);
    }
  };

  // Pagination
  const totalResults = blogs.length;
  const paginatedData = blogs.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <>
      <PageTitle>Customer Blogs</PageTitle>
      <SectionTitle>All Blogs for Customer</SectionTitle>

      <Button className="mb-4" onClick={() => history.goBack()}>
        Back to Customers
      </Button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading blogs...</p>
        </div>
      ) : (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Blog Heading</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((blog, i) => (
                  <TableRow key={blog._id || i}>
                    <TableCell>{blog.heading || "-"}</TableCell>
                    <TableCell>{blog.description || "-"}</TableCell>
                    <TableCell>
                      {blog.image && blog.image.url ? (
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={blog.image.url}
                          alt="Blog image"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge type="success">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          layout="link"
                          size="icon"
                          onClick={() => openModal(blog)}
                          aria-label="Edit"
                        >
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button
                          layout="link"
                          size="icon"
                          onClick={() => handleDelete(blog._id)}
                          aria-label="Delete"
                        >
                          <TrashIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center">
                    No blogs found for this customer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {totalResults > 0 && (
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={setPage}
                  label="Table navigation"
                />
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      )}

      {/* Modal for Editing Blog */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Edit Blog Modal"
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
        <form onSubmit={handleSubmit}>
          <Label className="mt-2">
            <span>Blog Heading</span>
            <Input 
              name="heading" 
              value={formValues.heading} 
              onChange={handleChange} 
              required 
            />
          </Label>
          <Label className="mt-2">
            <span>Description</span>
            <Textarea 
              name="description" 
              value={formValues.description} 
              onChange={handleChange} 
              rows="3" 
            />
          </Label>
          <Label className="mt-2">
            <span>Blog Image</span>
            <Input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleChange} 
            />
          </Label>
          <div className="flex justify-end mt-4 space-x-2">
            <Button layout="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit">Update Blog</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default AllCustomerBlogs;