import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";

import { toast } from "sonner";
import { ConfirmToast } from "../toasts/ConfirmToast";





export function PopoverPassword() {

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const cambiarContrasena = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`http://localhost:8080/usuario/changePassword/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                    confirmPassword: passwords.confirmPassword
                })
            });

            if (passwords.newPassword.length < 8) {
                toast.warning("La nueva contraseña debe tener al menos 8 caracteres");
                return;
            }


            if (response.ok) {
                toast.success("Contraseña cambiada exitosamente");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                toast.error(errorText || "Error al cambiar la contraseña");
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            toast.error("Error al cambiar la contraseña");
        }
    };


    const handleClickCambiarContrasena = () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.warning("Las nuevas contraseñas no coinciden");
            return;
        }

        toast.custom((t) => (
            <ConfirmToast
                message="¿Desea cambiar la contraseña?"
                onConfirm={() => cambiarContrasena()}
                onCancel={() => toast.dismiss(t)}
            />
        ));
    };


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Cambiar contraseña</Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Cambiar contraseña</h4>
                        <p className="text-sm text-muted-foreground">
                            Introduce tu contraseña actual y la nueva.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="currentPassword">Actual</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                className="col-span-2 h-8"
                                value={passwords.currentPassword}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, currentPassword: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="newPassword">Nueva</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                className="col-span-2 h-8"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, newPassword: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="confirmPassword">Repetir</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                className="col-span-2 h-8"
                                value={passwords.confirmPassword}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                                }
                            />
                        </div>
                        <Button className="mt-4" onClick={handleClickCambiarContrasena}>
                            Confirmar cambio
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>

    )
}
