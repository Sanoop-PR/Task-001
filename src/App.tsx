import { Box } from '@mui/material'
import './App.css'
import Header from './components/header'
import UserTable from './components/user-table'

function App() {
  return (
    <Box component="section" sx={{ p: 5 }}>
      <Header />
      <UserTable />
    </Box>
  )
}

export default App
