import { lazy } from 'react'
import AddCustomer from '../components/common/AddCustomer'
import UpdateCustomer from '../components/common/UpdateCustomer'
import UpdateSeller from '../components/common/UpdateSeller'
import AddSeller from '../components/common/AddSeller'
import UpdateCustomerProduct from '../components/common/UpdateCustomerProduct'
import AddCustomerProduct from '../components/common/AddCustomerProduct'
import AddCustomerBlog from '../components/common/AddCustomerBlog'
import UpdateCustomerBlog from '../components/common/UpdateCustomerBlog'
import AllCustomers from '../components/common/AllCustomers'
import AllSellers from '../components/common/AllSellers'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const Tables = lazy(() => import('../pages/Tables'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/add-customer',
    component: AddCustomer,
  },
  {
    path: '/add-customer-product',
    component: AddCustomerProduct,
  },
  {
    path: '/add-customer-blog',
    component: AddCustomerBlog,
  },
   {
    path: '/app/update-customer-blog/:id',
    component: UpdateCustomer,
  },
  {
    path: '/update-customer-product',
    component: UpdateCustomerProduct,
  },
  {
    path: '/update-customer-blog',
    component: UpdateCustomerBlog,
  },
  {
    path: '/all-customers',
    component: AllCustomers,
  },
  {
    path: '/update-customer-blog',
    component: UpdateCustomerBlog,
  },
 
  {
    path: '/add-Seller',
    component: AddSeller,
  },
  {
    path: '/Update-seller',
    component: UpdateSeller,
  },
  {
    path: '/all-sellers',
    component: AllSellers,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/tables',
    component: Tables,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
