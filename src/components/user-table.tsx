import * as React from 'react';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UserFormModal from './user-form-modal';
import { useAppDispatch, useAppSelector } from '../dispatch-hook';
import { getAllUsers } from '../slice/getUserSlice';
import { useEffect } from 'react';

const initialRows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function UserTable() {
    const [rows, setRows] = React.useState(initialRows);
    const dispatch = useAppDispatch();
    const { users, loading, error } = useAppSelector((state) => state.users);

    const handleEdit = (data: any) => {
        console.log(data)
    };

    const handleDelete = (id: number) => {
        const confirmDelete = confirm(`Delete row with ID: ${id}?`);
        if (confirmDelete) {
            setRows(prev => prev.filter(row => row.id !== id));
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Full name', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        {
            field: 'company',
            headerName: 'website',
            width: 90,
            valueGetter: (params: any) => params.name ?? "N/A",
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 160,
            valueGetter: (params: any) => params.city ?? "N/A",
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack
                    direction="row"
                    spacing={1}
                >
                    <UserFormModal>
                        <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(params.row)}
                        >
                            Edit
                        </Button>
                    </UserFormModal>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </Stack>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 5 };
    
    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);
    
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    
    return (
        <Paper sx={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={users}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}
