"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  PlayCircleIcon,
  PencilSquareIcon,
  PhoneArrowDownLeftIcon,
  ComputerDesktopIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import StatsCard from "@/components/stats-card";


const STATS = [
  {
    icon: DocumentTextIcon,
    count: "10,200+",
    title: "Horas de League of Legends",
    color: "text-orange-500",
  },
  {
    icon: CheckBadgeIcon,
    count: "50+",
    title: "Baneos por decir Sopa du Mac*aco",
  },
  {
    icon: ClockIcon,
    count: "0",
    title: "Horas desde la ultima eszopiclona",
  },
  {
    icon: ComputerDesktopIcon,
    count: "24/7",
    title: "Flameando en el Valo",
  },
];

export function OutImpressiveStats() {
  return (
    <section className="px-8 pt-60">
      <div className="container mx-auto text-center lg:text-left">
        <div className="grid place-items-center text-center">
          <Typography variant="h2" className="mb-2 text-4xl text-orange-900">
            Mis estadísticas
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-24 w-full !text-gray-500 lg:w-5/12"
          >
            Orgulloso de mis logros y de lo que he conseguido en mis años de vida.
          </Typography>
        </div>
        <div className="grid gap-y-16 gap-x-10 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((props, key) => (
            <StatsCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default OutImpressiveStats;