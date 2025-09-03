import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SectionTitle from "../Typography/SectionTitle";
import { Input, Label, Textarea, Button } from "@windmill/react-ui";
import PageTitle from "../Typography/PageTitle";
import api from "../../api/axios";
import { Toaster, toast } from "react-hot-toast";

// Validation schema
const validationSchema = Yup.object({
  slug: Yup.string().required("Slug is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email"),
  contact: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be at most 15 digits")
    .nullable(),
  metaTitle: Yup.string().nullable(),
  metaKeywords: Yup.string().nullable(), // comma-separated string
  metaDescription: Yup.string().nullable(),
});

function AddCustomer() {
  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();

        // Append normal fields
        Object.keys(values).forEach((key) => {
          if (key === "galleryImages" && values.galleryImages?.length > 0) {
            Array.from(values.galleryImages).forEach((file) => {
              formData.append("galleryImages", file);
            });
          } else if (key === "bannerImage" && values.bannerImage) {
            formData.append("bannerImage", values.bannerImage);
          } else if (key === "profileImage" && values.profileImage) {
            formData.append("profileImage", values.profileImage);
          } else if (
            !["bannerImage", "profileImage", "galleryImages", "metaKeywords"].includes(
              key
            ) &&
            values[key]
          ) {
            formData.append(key, values[key]);
          }
        });

        // SEO fields
        if (values.metaTitle) formData.append("metaTitle", values.metaTitle);
        if (values.metaDescription)
          formData.append("metaDescription", values.metaDescription);

        if (values.metaKeywords) {
          // Convert comma-separated keywords into array JSON string
          const keywordsArray = values.metaKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k); // remove empty strings
          formData.append("metaKeywords", JSON.stringify(keywordsArray));
        }

        // API call
        await toast.promise(
          api.post("/customer/addcustomer", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            loading: "Adding customer...",
            success: "✅ Customer added successfully!",
            error: (err) =>
              err?.response?.data?.message || "❌ Failed to add customer",
          }
        );

        resetForm();
        document.querySelectorAll('input[type="file"]').forEach((input) => {
          input.value = "";
        });
      } catch (error) {
        console.error("Add Customer Error:", error);
      }
    },
  });

  return (
    <>
      <PageTitle>Add Customer</PageTitle>
      <SectionTitle>Customer Details</SectionTitle>

      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          {/* Slug */}
          <Label className="mt-4">
            <span>Slug</span>
            <Input
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              placeholder="unique-slug"
            />
          </Label>

          {/* Name */}
          <Label className="mt-4">
            <span>Name</span>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Jane Doe"
            />
          </Label>

          {/* Business Name */}
          <Label className="mt-4">
            <span>Business Name</span>
            <Input
              name="businessName"
              value={formik.values.businessName}
              onChange={formik.handleChange}
              placeholder="Business Name"
            />
          </Label>

          {/* Location */}
          <Label className="mt-4">
            <span>Location</span>
            <Input
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              placeholder="City, State"
            />
          </Label>

          {/* Email */}
          <Label className="mt-4">
            <span>Email</span>
            <Input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="example@email.com"
            />
          </Label>

          {/* Contact */}
          <Label className="mt-4">
            <span>Contact</span>
            <Input
              name="contact"
              value={formik.values.contact}
              onChange={formik.handleChange}
              placeholder="1234567890"
            />
          </Label>

          {/* Alternate Number */}
          <Label className="mt-4">
            <span>Alternate Number</span>
            <Input
              name="numberalternative"
              value={formik.values.numberalternative}
              onChange={formik.handleChange}
              placeholder="Optional"
            />
          </Label>

          {/* WhatsApp */}
          <Label className="mt-4">
            <span>WhatsApp</span>
            <Input
              name="whatsapp"
              value={formik.values.whatsapp}
              onChange={formik.handleChange}
              placeholder="WhatsApp Number"
            />
          </Label>

          {/* Instagram */}
          <Label className="mt-4">
            <span>Instagram</span>
            <Input
              name="instagram"
              value={formik.values.instagram}
              onChange={formik.handleChange}
              placeholder="@username"
            />
          </Label>

          {/* Facebook */}
          <Label className="mt-4">
            <span>Facebook</span>
            <Input
              name="facebook"
              value={formik.values.facebook}
              onChange={formik.handleChange}
              placeholder="Facebook Profile/URL"
            />
          </Label>

          {/* YouTube */}
          <Label className="mt-4">
            <span>YouTube</span>
            <Input
              name="youtube"
              value={formik.values.youtube}
              onChange={formik.handleChange}
              placeholder="YouTube Channel URL"
            />
          </Label>

          {/* Description */}
          <Label className="mt-4">
            <span>Description</span>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Enter description here"
            />
          </Label>

          {/* SEO Fields */}
          <Label className="mt-4">
            <span>Meta Title</span>
            <Input
              name="metaTitle"
              value={formik.values.metaTitle}
              onChange={formik.handleChange}
              placeholder="Enter meta title"
            />
          </Label>

          <Label className="mt-4">
            <span>Meta Keywords (comma separated)</span>
            <Input
              name="metaKeywords"
              value={formik.values.metaKeywords}
              onChange={formik.handleChange}
              placeholder="keyword1, keyword2, keyword3"
            />
          </Label>

          <Label className="mt-4">
            <span>Meta Description</span>
            <Textarea
              name="metaDescription"
              value={formik.values.metaDescription}
              onChange={formik.handleChange}
              placeholder="Enter meta description here"
            />
          </Label>

          {/* Banner Image */}
          <Label className="mt-4">
            <span>Banner Image</span>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => formik.setFieldValue("bannerImage", e.target.files[0])}
            />
          </Label>

          {/* Profile Image */}
          <Label className="mt-4">
            <span>Profile Image</span>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => formik.setFieldValue("profileImage", e.target.files[0])}
            />
          </Label>

          {/* Gallery Images */}
          <Label className="mt-4">
            <span>Gallery Images</span>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => formik.setFieldValue("galleryImages", e.target.files)}
            />
          </Label>

          {/* Submit */}
          <div className="flex justify-center mt-5 mb-3">
            <Button type="submit">Add Customer</Button>
          </div>
        </div>
      </form>

      <Toaster position="top-right" />
    </>
  );
}

export default AddCustomer;
