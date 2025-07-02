import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Bills from "./pages/Bills"
import AddBill from "./pages/AddBill"
import EditBill from "./pages/EditBill"
import Settings from "./pages/Settings"
import Users from "./pages/Users"
import BillDetails from "./pages/BillDetails"
import NotFound from "./pages/NotFound"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="bills" element={<Bills />} />
          <Route path="bills/add" element={<AddBill />} />
          <Route path="bills/:id" element={<BillDetails />} />
          <Route path="bills/:id/edit" element={<EditBill />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
