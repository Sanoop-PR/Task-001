import * as React from 'react';
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  Stack,
} from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Props {
  onConfirm: () => void;
  trigger: React.ReactNode;
  isLoading:boolean;
}

export default function DeleteModal({ onConfirm, trigger,isLoading }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <span onClick={handleOpen}>{trigger}</span>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" gutterBottom>
              Confirm Deletion
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete} loading={isLoading} loadingPosition="end">
                Delete
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
