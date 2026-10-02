import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import UserListPage from './pages/UserListPage'
import UserDetailPage from './pages/UserDetailPage'
import CreateUserPage from './pages/CreateUserPage'
import EditUserPage from './pages/EditUserPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<UserListPage />} />
        <Route path="users/new" element={<CreateUserPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="users/:id/edit" element={<EditUserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
