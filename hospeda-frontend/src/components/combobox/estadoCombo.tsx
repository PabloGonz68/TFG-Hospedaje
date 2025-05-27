"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
const estados = [
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "CONFIRMADA", label: "Confirmada" },
    { value: "COMPLETADA", label: "Completada" },
    { value: "CANCELADA", label: "Cancelada" }
];


export function EstadoCombo({ onChange }: { onChange: (value: string) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? estados.find((estado) => estado.value === value)?.label
                        : "Elige el nuevo estado"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar estado..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Estado no encontrado.</CommandEmpty>
                        <CommandGroup>
                            {estados.map((estado) => (
                                <CommandItem
                                    key={estado.value}
                                    value={estado.value}
                                    onSelect={(currentValue) => {
                                        const newValue = currentValue === value ? "" : currentValue
                                        setValue(newValue)
                                        setOpen(false)
                                        onChange(newValue)
                                    }}
                                >
                                    {estado.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === estado.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
