import * as React from 'react';
import {
  Backdrop, Box, Modal, Fade, Button, Typography, TextField, Stack,
} from '@mui/material';
import type { User } from '../type';

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
  user?: User;
  onSubmit: (formData: User) => void;
  trigger: React.ReactNode;
  isLoading: boolean;
}

export default function UserFormModal({ user, onSubmit, trigger, isLoading }: Props) {
  const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm(initialFormState);
    setOpen(false);
  };

  const initialFormState = user ?? {
    id: 1,
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: ""
      }
    },
    phone: "",
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: ""
    }
  };

  const [form, setForm] = React.useState<User>(initialFormState);

  React.useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'company') {
      setForm({
        ...form,
        company: {
          ...form.company,
          name: value,
        },
      });
    } else if (name === 'address') {
      setForm({
        ...form,
        address: {
          ...form.address,
          city: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!form.name.trim()) newErrors.name = 'Full name is required';

  if (!form.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Enter a valid email address';
  }

  if (!form.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(form.phone)) {
    newErrors.phone = 'Enter a valid 10-digit phone number';
  }

  if (!form.company.name.trim()) newErrors.company = 'Company name is required';
  if (!form.address.city.trim()) newErrors.address = 'City is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    handleClose();
  };

  return (
    <div>
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
            <Typography variant="h6" gutterBottom>
              {user ? 'Edit User' : 'Add User'}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                label="Company"
                name="company"
                value={form.company?.name || ''}
                onChange={handleChange}
                fullWidth
                error={!!errors.company}
                helperText={errors.company}
              />
              <TextField
                label="City"
                name="address"
                value={form.address?.city || ''}
                onChange={handleChange}
                fullWidth
                error={!!errors.address}
                helperText={errors.address}
              />

              <Button
                variant="contained"
                onClick={handleSubmit}
                loading={isLoading}
                loadingIndicator="Saving..."
              >
                {user ? 'Update' : 'Add'}
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
