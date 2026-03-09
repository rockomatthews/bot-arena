"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

export default function CreateBotDialog({
  open,
  onClose,
  name,
  setName,
  onCreate,
  disabled,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  setName: (v: string) => void;
  onCreate: () => Promise<void>;
  disabled: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Create a bot</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Bot name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={onCreate} variant="contained" disabled={disabled || !name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
