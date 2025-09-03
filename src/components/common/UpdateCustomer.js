import React, { useEffect, useState } from "react";
import { Input, Label, Textarea, Button } from "@windmill/react-ui";
import SectionTitle from "../Typography/SectionTitle";
import PageTitle from "../Typography/PageTitle";
import api from "../../api/axios";
import { Toaster, toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

function UpdateCustomer() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [formValues, setFormValues] = useState({
    slug: "",
    name: "",
    businessName: "",
    bannerImage: null,
    profileImage: null,
    location: "",
    email: "",
    contact: "",
    numberalternative: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    description: "",
    galleryImages: [],
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/customer/getcustomer/${id}`);
        const data = res.data.customer;

        setCustomer(data);

        setFormValues({
          slug: data.slug || "",
          name: data.name || "",
          businessName: data.businessName || "",
          location: data.location || "",
          email: data.email || "",
          contact: data.contact || "",
          numberalternative: data.numberalternative || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          youtube: data.youtube || "",
          description: data.description || "",
          bannerImage: null,
          profileImage: null,
          galleryImages: [],
          metaTitle: data.metaTitle || "",
          metaKeywords: Array.isArray(data.metaKeywords)
            ? data.metaKeywords.join(", ")
            : data.metaKeywords || "",
          metaDescription: data.metaDescription || "",
        });
      } catch (err) {
        toast.error("Failed to fetch customer data");
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (e.target.multiple) setFormValues({ ...formValues, [name]: files });
      else setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formValues.slug) errs.slug = "Slug is required";
    if (!formValues.name) errs.name = "Name is required";
    if (formValues.email && !/\S+@\S+\.\S+/.test(formValues.email))
      errs.email = "Invalid email";
    if (formValues.contact && !/^[0-9]{10,15}$/.test(formValues.contact))
      errs.contact = "Contact must be 10-15 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
      if (key === "galleryImages" && formValues.galleryImages?.length > 0) {
        Array.from(formValues.galleryImages).forEach((file) =>
          formData.append("galleryImages", file)
        );
      } else if (key === "metaKeywords") {
        const keywordsArray = formValues.metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k);
        formData.append("metaKeywords", JSON.stringify(keywordsArray));
      } else if (formValues[key]) {
        formData.append(key, formValues[key]);
      }
    });

    try {
      await api.put(`/customer/updatecustomer/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Customer updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "❌ Failed to update customer");
    }
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <>
      <PageTitle>Update Customer</PageTitle>
      <SectionTitle>Customer Details</SectionTitle>

      <form onSubmit={handleSubmit}>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          {/* Slug */}
          <Label className="mt-4">
            <span>Slug</span>
            <Input
              name="slug"
              value={formValues.slug}
              onChange={handleChange}
              placeholder="unique-slug"
              required
            />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
          </Label>

          {/* Name */}
          <Label className="mt-4">
            <span>Name</span>
            <Input
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </Label>

          {/* Business Name */}
          <Label className="mt-4">
            <span>Business Name</span>
            <Input
              name="businessName"
              value={formValues.businessName}
              onChange={handleChange}
            />
          </Label>

          {/* Location */}
          <Label className="mt-4">
            <span>Location</span>
            <Input
              name="location"
              value={formValues.location}
              onChange={handleChange}
            />
          </Label>

          {/* Email */}
          <Label className="mt-4">
            <span>Email</span>
            <Input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </Label>

          {/* Contact */}
          <Label className="mt-4">
            <span>Contact</span>
            <Input
              name="contact"
              value={formValues.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
          </Label>

          {/* SEO Fields */}
          <Label className="mt-4">
            <span>Meta Title</span>
            <Input
              name="metaTitle"
              value={formValues.metaTitle}
              onChange={handleChange}
              placeholder="Meta title"
            />
          </Label>

          <Label className="mt-4">
            <span>Meta Keywords (comma separated)</span>
            <Input
              name="metaKeywords"
              value={formValues.metaKeywords}
              onChange={handleChange}
              placeholder="keyword1, keyword2"
            />
          </Label>

          <Label className="mt-4">
            <span>Meta Description</span>
            <Textarea
              name="metaDescription"
              value={formValues.metaDescription}
              onChange={handleChange}
              placeholder="Meta description"
            />
          </Label>

          {/* Description */}
          <Label className="mt-4">
            <span>Description</span>
            <Textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
            />
          </Label>

          {/* Images */}
          <Label className="mt-4">
            <span>Banner Image</span>
            {customer?.bannerImage && (
              <img
                src={customer.bannerImage.url || customer.bannerImage}
                alt="Banner"
                className="h-20 w-20 object-cover rounded mb-2"
              />
            )}
            <Input
              type="file"
              name="bannerImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Profile Image</span>
            {customer?.profileImage && (
              <img
                src={customer.profileImage.url || customer.profileImage}
                alt="Profile"
                className="h-20 w-20 object-cover rounded mb-2"
              />
            )}
            <Input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Label>

          <Label className="mt-4">
            <span>Gallery Images</span>
            <div className="flex gap-2 flex-wrap mb-2">
              {customer?.galleryImages?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt={`Gallery-${idx}`}
                  className="h-20 w-20 object-cover rounded"
                />
              ))}
            </div>
            <Input
              type="file"
              multiple
              name="galleryImages"
              accept="image/*"
              onChange={handleChange}
            />
          </Label>

          {/* Submit */}
          <div className="flex justify-center mt-5 mb-3">
            <Button type="submit">Update Customer</Button>
          </div>
        </div>
      </form>

      <Toaster position="top-right" />
    </>
  );
}

export default UpdateCustomer;
