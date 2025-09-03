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
  Textarea,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../../icons";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AllCustomerProducts() {
  const { customerId } = useParams();
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    whatsappUrl: "",
    description: "",
    image: null,
  });

  const resultsPerPage = 10;

  // ✅ Fetch all products with toast
  const fetchProducts = async () => {
    try {
      const res = await toast.promise(
        api.get(`/products/getproducts/${customerId}`),
        {
          loading: "Fetching products...",
          success: "✅ Products loaded successfully!",
          error: "❌ Failed to fetch products",
        }
      );
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [customerId]);

  // Open modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setFormValues({
      name: product.name || "",
      whatsappUrl: product.whatsappUrl || "",
      description: product.description || "",
      image: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // ✅ Update product with toast
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("whatsappUrl", formValues.whatsappUrl);
    formData.append("description", formValues.description);
    formData.append("customerId", customerId);
    if (formValues.image) formData.append("image", formValues.image);

    try {
      const response = await toast.promise(
        api.put(`/products/updateproduct/${selectedProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        {
          loading: "Updating product...",
          success: "✅ Product updated successfully!",
          error: "❌ Failed to update product",
        }
      );

      if (response?.data) {
        closeModal();
        fetchProducts();
      }
    } catch (error) {
      console.error("Update product error:", error.response?.data || error.message);
    }
  };

  // ✅ Delete product with toast
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await toast.promise(api.delete(`/products/deleteproduct/${id}`), {
        loading: "Deleting product...",
        success: "✅ Product deleted successfully!",
        error: "❌ Failed to delete product",
      });
      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error.response?.data || error.message);
    }
  };

  // Pagination
  const totalResults = products.length;
  const paginatedData = products.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <>
      <PageTitle>Customer Products</PageTitle>
      <SectionTitle>All Products for Customer</SectionTitle>

      <Button className="mb-4" onClick={() => history.goBack()}>
        Back to Customers
      </Button>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Whatsapp URL</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>

          <TableBody>
            {paginatedData.map((product, i) => (
              <TableRow key={product._id || i}>
                <TableCell>{product.name || "-"}</TableCell>
                <TableCell>{product.description || "-"}</TableCell>
                <TableCell>
                  {product.whatsappUrl ? (
                    <a
                      href={product.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {product.image?.url ? (
                    <Avatar src={product.image.url} alt={product.name} />
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
                      onClick={() => openModal(product)}
                      aria-label="Edit"
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      onClick={() => handleDelete(product._id)}
                      aria-label="Delete"
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={setPage}
              label="Table navigation"
            />
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Modal for Editing Product */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Edit Product Modal"
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <Label className="mt-2">
            <span>Product Name</span>
            <Input name="name" value={formValues.name} onChange={handleChange} required />
          </Label>
          <Label className="mt-2">
            <span>Whatsapp URL</span>
            <Input name="whatsappUrl" value={formValues.whatsappUrl} onChange={handleChange} />
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
            <span>Product Image</span>
            <Input type="file" name="image" accept="image/*" onChange={handleChange} />
          </Label>
          <div className="flex justify-end mt-4 space-x-2">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default AllCustomerProducts;
