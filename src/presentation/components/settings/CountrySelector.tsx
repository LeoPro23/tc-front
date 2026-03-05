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
    { value: "51", label: "Perú", code: "+51", short: "PE" },
    { value: "57", label: "Colombia", code: "+57", short: "CO" },
    { value: "56", label: "Chile", code: "+56", short: "CL" },
    { value: "54", label: "Argentina", code: "+54", short: "AR" },
    { value: "52", label: "México", code: "+52", short: "MX" },
    { value: "593", label: "Ecuador", code: "+593", short: "EC" },
    { value: "591", label: "Bolivia", code: "+591", short: "BO" },
    { value: "55", label: "Brasil", code: "+55", short: "BR" },
    { value: "598", label: "Uruguay", code: "+598", short: "UY" },
    { value: "595", label: "Paraguay", code: "+595", short: "PY" },
    { value: "58", label: "Venezuela", code: "+58", short: "VE" },
    { value: "506", label: "Costa Rica", code: "+506", short: "CR" },
    { value: "507", label: "Panamá", code: "+507", short: "PA" },
    { value: "1809", label: "Rep. Dominicana", code: "+1-809", short: "DO" },
    { value: "34", label: "España", code: "+34", short: "ES" },
    { value: "1", label: "Estados Unidos / Canadá", code: "+1", short: "US/CA" },
]

export function CountrySelector({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) {
    const [open, setOpen] = React.useState(false)

    const selectedCountry = countries.find((country) => country.value === value || country.short === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[140px] justify-between px-4 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                    {selectedCountry ? `${selectedCountry.code} (${selectedCountry.short})` : "País"}
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
                                            selectedCountry?.value === country.value ? "opacity-100" : "opacity-0"
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
