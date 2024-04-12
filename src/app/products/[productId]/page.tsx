import { BackButton } from "@/components/back-button"
import { db } from "@/db"
import { productsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    productId: string
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params

  if (!productId) {
    return notFound()
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId))

  if (!product) {
    return notFound()
  }

  return (
    <div className="py-8 pb-8 px-12 divide-y divide-zinc-100 bg-white shadow-md rounded-b-md">
      <div>
        <BackButton />

        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
        </div>

        <div className="aspect-square my-6 border border-border w-52 h-52">
          <div className="relative bg-zinc-100 w-full h-full overflow-hidden">
            <Image
              src={`/${product.imageId}`}
              fill
              loading="eager"
              alt="prod"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
