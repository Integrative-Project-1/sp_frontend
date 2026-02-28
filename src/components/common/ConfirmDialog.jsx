import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading, error }) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" disabled={loading} variant="contained">
          {loading ? <CircularProgress size={20} /> : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
