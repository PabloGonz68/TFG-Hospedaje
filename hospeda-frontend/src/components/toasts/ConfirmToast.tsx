import { toast } from "sonner";

export interface ConfirmToastProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmToast = ({ message, onConfirm, onCancel }: ConfirmToastProps) => {
    return (
        <div className="flex flex-col gap-2 bg-white border-gray-300 border-2 px-8 py-2 rounded-xl">
            <span className="font-medium">{message}</span>
            <div className="flex justify-center items-center gap-2">
                <button
                    onClick={() => {
                        onCancel();
                        toast.dismiss(); // Cierra el toast
                    }}
                    className="text-sm px-2 py-1  bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        toast.dismiss();
                    }}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};
