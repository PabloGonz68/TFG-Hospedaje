import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import { Edit } from "lucide-react"

export type Usuario = {
    id_usuario: string
    nombre: string,
    apellidos: string,
    email: string,
    fotoPerfil: string,
    fechaRegistro: Date,
    rol: 'USER' | 'ADMIN';
    password: string
}

interface SheetAdminUserProps {
    usuario: Usuario | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (usuarioActualizado: Usuario) => void
}

export function SheetAdminUser({
    usuario,
    open,
    onOpenChange,
}: SheetAdminUserProps) {
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [email, setEmail] = useState("")
    const [fotoPerfil, setFotoPerfil] = useState("https://upload.wikimedia.org/wikipedia/commons/f/ff/Joaquin_2022_%28cropped%29.jpg");

    const [rol, setRol] = useState<"USER" | "ADMIN">("USER")
    const [password, setPassword] = useState("")



    useEffect(() => {
        if (usuario) {
            setNombre(usuario.nombre)
            setApellidos(usuario.apellidos)
            setEmail(usuario.email)
            setFotoPerfil(usuario.fotoPerfil || "")
            setRol(usuario.rol)
            setPassword("")
        }
    }, [usuario])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        console.log("El token es:", token)
        if (!usuario || !token) return
        console.log("Usuario ID:", usuario.id_usuario);



        try {
            const datosActualizados: any = {
                nombre,
                apellidos,
                email,
                fotoPerfil,
                rol,
            }

            if (password && password.trim() !== "") {
                datosActualizados.password = password
            }

            console.log("Body enviado:", JSON.stringify(datosActualizados));
            const response = await fetch(`http://localhost:8080/usuario/admin/${usuario.id_usuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(datosActualizados)

            })

            if (response.ok) {
                const updatedUser = await response.json()
                console.log("Perfil actualizado:", updatedUser)
                toast.success("Perfil actualizado exitosamente")
                onOpenChange(false)
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error)
            toast.error("Error al conectar con el servidor " + error)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="text-blanco">
                <SheetHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="flex p-2 items-center bg-principal rounded-xl">
                                <Edit className="w-6 h-6 text-negro" />
                            </div>
                            <SheetTitle className="text-principal">Editar perfil</SheetTitle>
                        </div>

                        <div>

                            <SheetDescription className="text-blanco">
                                Modifica los datos del usuario aquí. Haz click en guardar cuando
                                termines.
                            </SheetDescription>
                        </div>
                    </div>

                </SheetHeader>
                {usuario ? (
                    <form onSubmit={handleSubmit} className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div className="grid gap-3">
                            <Label className="text-principal" htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label className="text-principal" htmlFor="apellidos">Apellidos</Label>
                            <Input id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label className="text-principal" htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label className="text-principal" htmlFor="fotoPerfil">Foto de perfil (URL)</Label>
                            <Input id="fotoPerfil" value={fotoPerfil} onChange={(e) => setFotoPerfil(e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            <Label className="text-principal" htmlFor="rol">Rol</Label>
                            <select
                                id="rol"
                                className="border rounded px-2 py-1"
                                value={rol}
                                onChange={(e) => setRol(e.target.value as "USER" | "ADMIN")}
                                required
                            >
                                <option className="text-principal bg-negro" value="USER">USER</option>
                                <option className="text-principal bg-negro" value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="grid gap-3">
                            <Label className="text-principal" htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                        </div>
                        <SheetFooter>
                            <Button className="bg-principal text-negro hover:bg-principal-hover " type="submit">Guardar cambios</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Cerrar</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                ) : (
                    <div className="p-4">Cargando usuario...</div>
                )}
            </SheetContent>
        </Sheet>
    )
}
