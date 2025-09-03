/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    path: '/app/add-customer',
    icon: 'FormsIcon',
    name: 'Add Customer',
  },
  {
    path: '/app/add-customer-product',
    icon: 'FormsIcon',
    name: 'Add Customer Product',
  },
  {
    path: '/app/add-customer-blog',
    icon: 'FormsIcon',
    name: 'Add Customer Blog',
  },
  {
    path: '/app/all-customers',
    icon: 'CardsIcon',
    name: 'All Customers',
  },
  {
    path: '/app/add-seller',
    icon: 'ChartsIcon',
    name: 'Add Seller',
  },
  {
    path: '/app/all-sellers',
     icon: 'CardsIcon',
    name: 'All Seller',
  },
]

export default routes
