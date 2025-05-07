
import React from 'react';
import { Button } from './button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'destructive',
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  return (
    <div className="bg-card rounded-lg shadow-lg max-w-md w-full overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-accent">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          {title}
        </h3>
        <button
          className="text-muted-foreground hover:text-foreground rounded-full p-1"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-6">
        <p className="text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;