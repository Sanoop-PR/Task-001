import { Button, Stack, Typography } from "@mui/material"
import UserFormModal from "./user-form-modal"
import type { User } from "../type"
import { useAppDispatch, useAppSelector } from "../dispatch-hook";
import { addUser } from "../slice/userSlice";

function Header() {
    const dispatch = useAppDispatch();
    const { addLoading } = useAppSelector((state) => state.users);

    return (
        <Stack
            direction="row"
            spacing={0}
            sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography gutterBottom variant="h5" component="div">
                User Table
            </Typography>
            <UserFormModal
                onSubmit={(user: User) => dispatch(addUser(user))}
                isLoading={addLoading}
                trigger={
                    <Button variant="outlined" size="small" color="primary">
                        Add
                    </Button>
                }
            />
        </Stack>
    )
}

export default Header