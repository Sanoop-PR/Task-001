import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UserFormModal from './user-form-modal';
import { useAppDispatch, useAppSelector } from '../dispatch-hook';
import { deleteUser, getAllUsers, updateUser } from '../slice/userSlice';
import { useEffect } from 'react';
import type { User } from '../type';
import DeleteModal from './delete-modal';
import { Alert } from '@mui/material';

export default function UserTable() {
    const dispatch = useAppDispatch();
    const { users, error, updateLoading, deleteLoading, deleteError,updateError,addError } = useAppSelector((state) => state.users);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Full name', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        {
            field: 'company',
            headerName: 'Company',
            width: 130,
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
                    <UserFormModal
                        user={params.row}
                        onSubmit={(updatedUser: User) => dispatch(updateUser(updatedUser))}
                        isLoading={updateLoading}
                        trigger={
                            <Button variant="outlined" size="small" color="primary">
                                Edit
                            </Button>
                        }
                    />
                    <DeleteModal
                        onConfirm={() => dispatch(deleteUser(params.row.id))}
                        isLoading={deleteLoading}
                        trigger={
                            <Button variant="outlined" color="error" size="small">
                                Delete
                            </Button>
                        }
                    />

                </Stack>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 7 };

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);


    // if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <Stack spacing={3}>
            {deleteError &&
                <Alert variant="outlined" severity="error">
                    {deleteError}
                </Alert>
            }
            {updateError &&
                <Alert variant="outlined" severity="error">
                    {deleteError}
                </Alert>
            }
            {addError &&
                <Alert variant="outlined" severity="error">
                    {deleteError}
                </Alert>
            }
            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[7, 14]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
        </Stack>
    );
}
