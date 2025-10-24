"use client";
import CountryMap from "./CountryMap";
import { useState } from "react";
import { MoreDotIcon } from "@/features/admin/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((s) => !s);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Trámites por país</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Distribución geográfica</p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} width="w-[160px]">
            <DropdownItem href="#">Exportar</DropdownItem>
            <DropdownItem href="#">Ver detalle</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="pt-5">
        <CountryMap />
      </div>
    </div>
  );
}
