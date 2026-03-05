"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/presentation/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/presentation/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover"

export const countries = [
    { value: "PE", label: "Perú", code: "+51" },
    { value: "CO", label: "Colombia", code: "+57" },
    { value: "CL", label: "Chile", code: "+56" },
    { value: "AR", label: "Argentina", code: "+54" },
    { value: "MX", label: "México", code: "+52" },
    { value: "EC", label: "Ecuador", code: "+593" },
    { value: "BO", label: "Bolivia", code: "+591" },
    { value: "BR", label: "Brasil", code: "+55" },
    { value: "UY", label: "Uruguay", code: "+598" },
    { value: "PY", label: "Paraguay", code: "+595" },
    { value: "VE", label: "Venezuela", code: "+58" },
    { value: "CR", label: "Costa Rica", code: "+506" },
    { value: "PA", label: "Panamá", code: "+507" },
    { value: "DO", label: "Rep. Dominicana", code: "+1-809" },
    { value: "ES", label: "España", code: "+34" },
    { value: "US", label: "Estados Unidos", code: "+1" },
    { value: "CA", label: "Canadá", code: "+1" },
]

export function CountrySelector({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) {
    const [open, setOpen] = React.useState(false)

    const selectedCountry = countries.find((country) => country.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[140px] justify-between px-4 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                    {selectedCountry ? `${selectedCountry.code} (${selectedCountry.value})` : "País"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 z-50">
                <Command>
                    <CommandInput placeholder="Buscar país..." />
                    <CommandList>
                        <CommandEmpty>País no encontrado.</CommandEmpty>
                        <CommandGroup>
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={() => {
                                        onChange(country.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === country.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {country.label} ({country.code})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
