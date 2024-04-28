"use client";
import { CardDescription, CardTitle } from "@/components/ui/card";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { RiComputerLine } from "react-icons/ri";

export default function ThemeSwitch() {
	const { setTheme, theme } = useTheme();
	return (
		<>
			<CardTitle>Theme</CardTitle>
			<ToggleGroup
				value={theme}
				type="single"
				variant={"outline"}
			>
				<ToggleGroupItem
					value="light"
					aria-label="Toggle light"
					className="h-fit p-3 flex-col gap-4 aspect-square w-full"
					onClick={() => setTheme("light")}
				>
					<SunIcon className="h-10 md:h-14 w-10 md:w-14" />
					<span>Light Mode</span>
				</ToggleGroupItem>
				<ToggleGroupItem
					value="dark"
					aria-label="Toggle dark"
					className="h-fit p-3 flex-col gap-4 aspect-square w-full"
					onClick={() => setTheme("dark")}
				>
					<MoonIcon className="h-10 md:h-14 w-10 md:w-14" />
					<span>Dark Mode</span>
				</ToggleGroupItem>
				<ToggleGroupItem
					value="system"
					aria-label="Toggle system"
					className="h-fit p-3 flex-col gap-4 aspect-square w-full"
					onClick={() => setTheme("system")}
				>
					<RiComputerLine className="h-10 md:h-14 w-10 md:w-14" />
					<span>System Theme</span>
				</ToggleGroupItem>
			</ToggleGroup>
			<CardDescription>Select your preferred theme.</CardDescription>
		</>
	);
}
