import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import PageTitle from "../Typography/PageTitle";
import SectionTitle from "../Typography/SectionTitle";
import { Input, HelperText, Label, Textarea, Button } from "@windmill/react-ui";
import api from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";

function UpdateSeller() {
  const { id } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    logo: null,
    tagline: "",
    description: "",
    rating: 0,
    totalReviews: 0,
    totalProducts: 0,
    followers: 0,
    responseTime: "",
    returnRate: "",
    verified: false,
    shopneoLink: "",
    category: [],
    seoTitle: "",
    seoKeywords: "",
    seoDescription: "",
  });

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Groceries",
  ];

  // Fetch seller by id
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await api.get(`/seller/getseller/${id}`);
        const seller = data.seller;

        setFormData({
          slug: seller.slug || "",
          name: seller.name || "",
          logo: null,
          tagline: seller.tagline || "",
          description: seller.description || "",
          rating: seller.rating || 0,
          totalReviews: seller.totalReviews || 0,
          totalProducts: seller.totalProducts || 0,
          followers: seller.followers || 0,
          responseTime: seller.responseTime || "",
          returnRate: seller.returnRate || "",
          verified: seller.verified || false,
          shopneoLink: seller.shopneoLink || "",
          category: seller.category || [],
          seoTitle: seller.seoTitle || "",
          seoKeywords: seller.seoKeywords ? seller.seoKeywords.join(",") : "",
          seoDescription: seller.seoDescription || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch seller");
      }
    };

    fetchSeller();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setFormData({ ...formData, [name]: files[0] });
    else if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((p) => ({ ...p, category: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("slug", formData.slug);
    data.append("name", formData.name);
    if (formData.logo) data.append("logo", formData.logo);
    data.append("tagline", formData.tagline);
    data.append("description", formData.description);
    data.append("rating", String(formData.rating));
    data.append("totalReviews", String(formData.totalReviews));
    data.append("totalProducts", String(formData.totalProducts));
    data.append("followers", String(formData.followers));
    data.append("responseTime", formData.responseTime);
    data.append("returnRate", formData.returnRate);
    data.append("verified", String(formData.verified));
    data.append("shopneoLink", formData.shopneoLink);
    data.append("category", formData.category.join(","));
    data.append("seoTitle", formData.seoTitle);
    data.append("seoKeywords", formData.seoKeywords);
    data.append("seoDescription", formData.seoDescription);

    try {
      await api.put(`/seller/updateseller/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Seller updated successfully!");
      history.push("/app/all-sellers"); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to update seller");
    }
  };

  return (
    <>
      <Toaster />
      <PageTitle>Update Seller</PageTitle>
      <SectionTitle>Edit Seller Details</SectionTitle>

      <form onSubmit={handleSubmit}>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label>
            <span>Slug</span>
            <Input
              className="mt-1"
              placeholder="unique-slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </Label>

          <Label className="mt-4">
            <span>Name</span>
            <Input
              className="mt-1"
              placeholder="Seller Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Label>

          <Label className="mt-4">
            <span>Logo</span>
            <Input
              type="file"
              className="mt-1"
              name="logo"
              accept="image/*"
              onChange={handleChange}
            />
            <HelperText>
              Current: (Logo already uploaded, upload new to replace)
            </HelperText>
          </Label>

          <Label className="mt-4">
            <span>Tagline</span>
            <Input
              className="mt-1"
              placeholder="Your shop tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Description</span>
            <Textarea
              className="mt-1"
              rows="3"
              placeholder="Enter shop description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Rating</span>
            <Input
              type="number"
              min="0"
              max="5"
              className="mt-1"
              name="rating"
              placeholder="0-5"
              value={formData.rating}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Total Reviews</span>
            <Input
              type="number"
              className="mt-1"
              name="totalReviews"
              placeholder="0"
              value={formData.totalReviews}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Total Products</span>
            <Input
              type="number"
              className="mt-1"
              name="totalProducts"
              placeholder="0"
              value={formData.totalProducts}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Followers</span>
            <Input
              type="number"
              className="mt-1"
              name="followers"
              placeholder="0"
              value={formData.followers}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Response Time</span>
            <Input
              className="mt-1"
              placeholder="e.g. 2 hours"
              name="responseTime"
              value={formData.responseTime}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Return Rate</span>
            <Input
              className="mt-1"
              placeholder="e.g. 5%"
              name="returnRate"
              value={formData.returnRate}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4" check>
            <Input
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
            />
            <span className="ml-2">Verified Seller</span>
          </Label>

          <Label className="mt-4">
            <span>Shopneo Link</span>
            <Input
              className="mt-1"
              placeholder="https://shopneo.com/seller"
              name="shopneoLink"
              value={formData.shopneoLink}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Category (multi-select)</span>
            <select
              multiple
              name="category"
              className="mt-1 p-2 border rounded w-full dark:bg-gray-700"
              value={formData.category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <HelperText>
              Hold CTRL (Windows) or CMD (Mac) to select multiple
            </HelperText>
          </Label>

          <Label className="mt-4">
            <span>SEO Title</span>
            <Input
              className="mt-1"
              placeholder="SEO friendly title"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>SEO Keywords</span>
            <Input
              className="mt-1"
              placeholder="Comma separated keywords"
              name="seoKeywords"
              value={formData.seoKeywords}
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>SEO Description</span>
            <Textarea
              className="mt-1"
              rows="2"
              placeholder="SEO description here"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
            />
          </Label>

          <div className="flex justify-center mt-6">
            <Button type="submit">Update Seller</Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateSeller;
