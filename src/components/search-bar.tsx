"use client"

import React, { useRef, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Loader2, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export const SearchBar = () => {
  const searchParams = useSearchParams()
  const defaultQuery = searchParams.get("query") || ""
  const inputRef = useRef<HTMLInputElement>(null)

  const [isSearching, startTransition] = useTransition()
  const [query, setQuery] = useState<string>(defaultQuery)

  const router = useRouter()

  const search = () => {
    startTransition(() => {
      router.push(`/search?query=${query}`)
    })
  }

  return (
    <div className="relative w-full h-14 flex flex-col bg-white">
      <div className="relative h-14 z-10 rounded-md">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search()
            }

            if (e.key === "Escape") {
              inputRef?.current?.blur()
            }
          }}
          ref={inputRef}
          disabled={isSearching}
          className="absolute inset-0 h-full"
          placeholder="Search..."
        />

        <Button
          disabled={isSearching}
          size="sm"
          onClick={search}
          className="absolute right-0 inset-y-0 h-full rounded-l-none"
        >
          {isSearching ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <Search className="size-6" />
          )}
        </Button>
      </div>
    </div>
  )
}
