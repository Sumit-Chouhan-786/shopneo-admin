import React from 'react'
import PageTitle from '../Typography/PageTitle'
import SectionTitle from '../Typography/SectionTitle'
import { Input, Label, Textarea } from '@windmill/react-ui'
import { Button } from '@windmill/react-ui'

function UpdateCustomerProduct() {
  return (
    <>
      <PageTitle>Update Customer</PageTitle>

      <SectionTitle>Elements</SectionTitle>

  <form
  onSubmit={(e) => {
    e.preventDefault();
  }}
>
 <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
    {/* Heading */}
    <Label className="mt-4">
      <span>Heading</span>
      <Input
        className="mt-1"
        placeholder="Enter blog heading"
        name="name"
        required
      />
    </Label>
     {/* whatsapp Url */}
    <Label className="mt-4">
      <span>whatsapp Url</span>
      <Input
        className="mt-1"
        rows="3"
        placeholder="Enter url here"
        name="whatsappUrl"
      />
    </Label>

    {/* Description */}
    <Label className="mt-4">
      <span>Description</span>
      <Textarea
        className="mt-1"
        rows="3"
        placeholder="Enter description here"
        name="description"
      />
    </Label>
    {/* Product Image */}
    <Label className="mt-4">
      <span>Product Image</span>
      <Input
        type="file"
        className="mt-1"
        name="profileImage"
        accept="image/*"
      />
    </Label>

    {/* Privacy Policy */}
    <Label className="mt-6" check>
      <Input type="checkbox" name="agree" required />
      <span className="ml-2">
        I agree to the <span className="underline">privacy policy</span>
      </span>
    </Label>
  </div>

  {/* Submit Button */}
  <div className="flex justify-center mb-6">
    <Button
      type="submit"
      className="px-6 py-2 mt-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      Add Customer blog
    </Button>
  </div>
</form>
    </>
  )
}

export default UpdateCustomerProduct
