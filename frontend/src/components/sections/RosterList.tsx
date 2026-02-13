"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import { players } from "@/lib/players";
import type { ComponentRendering } from "@/lib/types/cms";

const positionGroups = ["All", "Offense", "Defense", "Special Teams"] as const;

type RosterListProps = {
  rendering: ComponentRendering;
};

export function RosterList({ rendering }: RosterListProps) {
  const [activeGroup, setActiveGroup] = useState<"All" | "Offense" | "Defense" | "Special Teams">("All");

  const filtered =
    activeGroup === "All"
      ? players
      : players.filter((p) => p.positionGroup.includes(activeGroup));

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
            2025-2026 Season
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            Full Roster
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {positionGroups.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setActiveGroup(group)}
              className={`rounded-lg px-4 py-2 font-display text-sm font-medium uppercase tracking-wider transition-colors ${
                activeGroup === group
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Table */}
        <TableContainer
          sx={{
            bgcolor: "transparent",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    borderColor: "divider",
                    fontFamily: "var(--font-oswald), sans-serif",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                    py: 2,
                  },
                }}
              >
                <TableCell>#</TableCell>
                <TableCell>Player</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Position
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Year
                </TableCell>
                <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                  HT / WT
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Stats
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((player) => (
                <TableRow
                  key={player.id}
                  component={Link}
                  href={`/roster/${player.id}`}
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    "&:hover": {
                      bgcolor: "rgba(212,160,23,0.06)",
                    },
                    "& td": {
                      borderColor: "divider",
                      py: 2,
                    },
                  }}
                >
                  <TableCell>
                    <span className="font-display text-lg font-bold text-primary">
                      {player.number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={player.image || "/placeholder.svg"}
                          alt={player.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                          {player.name}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {player.position}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <Chip
                      label={player.position}
                      size="small"
                      sx={{
                        bgcolor: "secondary.main",
                        color: "text.primary",
                        fontSize: "0.7rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <span className="text-sm text-muted-foreground">
                      {player.year}
                    </span>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                    <span className="text-sm text-muted-foreground">
                      {player.height} / {player.weight}
                    </span>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <span className="text-xs tracking-wide text-muted-foreground">
                      {player.stats}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
}
