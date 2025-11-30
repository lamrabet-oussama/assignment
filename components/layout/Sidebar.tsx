"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import LogoutButton from "../auth/LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Home", href: "/dashboard/", icon: HomeIcon },
  { name: "Agencies", href: "/dashboard/agencies", icon: BuildingOfficeIcon },
  { name: "Contacts", href: "/dashboard/contacts", icon: UserGroupIcon },
];


const upgradeNavigation = [
  {
    name: "Upgrade to Pro",
    href: "/dashboard/upgrade",
    icon: () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z"
        />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out lg:absolute lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 bg-gray-900 border-b border-gray-800 flex-shrink-0">
          <h1 className="text-white text-base font-semibold tracking-tight">
            Dashboard
          </h1>

          <button
            className="lg:hidden text-gray-400 hover:text-gray-200 transition-colors"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation scrollable area */}
        <div className="flex-1 overflow-y-auto px-4">
          <nav className="mt-6">
            <div className="space-y-0.5">
              {navigation.map((item) => {
                const normalizePath = (path: string) =>
                  path.replace(/\/+$/, "");
                const isActive =
                  normalizePath(pathname) === normalizePath(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center px-2.5 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-4 w-4",
                        isActive
                          ? "text-gray-300"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom section - FIXED at bottom */}
        <div className="flex-shrink-0 px-4 pb-4 border-t border-gray-200 bg-gray-50">
          {/* Upgrade */}
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2.5 mb-3 mt-4">
            Upgrade
          </div>

          {upgradeNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center px-2.5 py-2.5 text-sm font-medium rounded-md border transition-all",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg shadow-purple-500/25"
                    : "text-purple-700 border-purple-200/80 bg-gradient-to-r from-purple-50 to-blue-50 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10"
                )}
              >
                <Icon />
                <span className="ml-3 font-semibold">{item.name}</span>

                <svg
                  className="ml-auto h-3.5 w-3.5 opacity-60 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            );
          })}

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <LogoutButton variant="sidebar" />
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 font-medium text-center mt-3">
            © 2025 Dashboard Pro
          </p>
        </div>
      </div>
    </>
  );
}
