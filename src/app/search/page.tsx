import { db } from "@/db"
import { productsTable } from "@/db/schema"
import { sql } from "drizzle-orm"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import React, { Suspense } from "react"
import Loading from "./loading"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const SearchPage = async ({ searchParams }: PageProps) => {
  const query = searchParams.query

  if (Array.isArray(query) || !query) {
    return redirect("/")
  }

  // query logic here

  let products = await db
    .select()
    .from(productsTable)
    .where(
      sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
        productsTable.description
      })) @@ to_tsquery('simple', lower(${query.trim().split(" ").join(" & ")}))`
    )
    .limit(3)

  if (products.length === 0) {
    return (
      <div className="text-center py-4 bg-white shadow-md rounded-b-md">
        <X className="mx-auto h-8 w-8 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No Results</h3>
        <p className="mt-1 text-sm mx-auto max-w-prose text-gray-500">
          Sorry, we could&apos;nt find anything for{" "}
          <span className="text-gray-600 font-medium">{query}</span>
        </p>
      </div>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <ul className="py-4 divide-y divide-zinc-100 bg-white shadow-md rounded-b-md">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
          >
            <li className="mx-auto py-4 px-8 flex space-x-4">
              <div className="relative flex items-center bg-zinc-100 rounded-lg h-40 w-40">
                <Image
                  fill
                  alt={product.imageId}
                  src={`/${product.imageId}`}
                />
              </div>

              <div className="w-full flex-1 space-y-2 py-1">
                <h1 className="text-lg font-medium text-gray-700">{product.name}</h1>

                <p className="prose prose-sm text-gray-500 line-clamp-2">{product.description}</p>

                <p className="text-base font-medium text-gray-700">$ {product.price}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </Suspense>
  )
}

export default SearchPage
