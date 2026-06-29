import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/products/ProductCarousel";
import ProductGrid from "@/components/products/ProductGrid";
import TrustStrip from "@/components/TrustStrip";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import { Product as ProductType } from "@/components/types";
import { connectDB } from "@/config/mongodb";
import ProductModel from "@/models/Product";

const DEFAULT_IMAGE = "/products/blue-haven.PNG";

function mapProduct(product: any): ProductType {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    images: product.images?.length ? product.images : [DEFAULT_IMAGE],
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    notes: product.notes,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldOut: product.status === "Sold Out",
  };
}

export default async function Home() {
  await connectDB();

  const products = await ProductModel.find({ status: "Active" })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

    console.log("asdf",products)

  const signatureSeries = products.slice(0, 4).map(mapProduct);
  const featured = products.filter(p => p.isFeatured).slice(0, 4).map(mapProduct);

  return (
    <main>
      <Header />
      <Hero />
      <ProductCarousel
        eyebrow="The Collection"
        title="Signature Series"
        products={signatureSeries}
        viewAllHref="/shop"
      />
      <TrustStrip />
      <ProductGrid
        eyebrow="Most Loved"
        title="Featured Fragrances"
        products={featured}
        viewAllHref="/shop"
      />
      <BrandStory imageSrc="/brand/story.jpg" />
      <Footer />
    </main>
  );
}
