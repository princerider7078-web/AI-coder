import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Star, Truck, RotateCcw, Shield } from 'lucide-react'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductHighlights } from '@/components/product/ProductHighlights'
import { ProductPricingPanel } from '@/components/product/ProductPricingPanel'
import { CareInstructions } from '@/components/product/CareInstructions'
import { ReviewsSection } from '@/components/product/ReviewsSection'
import { ProductFaqSection } from '@/components/product/ProductFaqSection'
import { StickyMobileBuyBar } from '@/components/product/StickyMobileBuyBar'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

interface ProductData {
  id: string; name: string; slug: string; sku: string
  description: string; shortDescription: string; about: string | null
  price: number; salePrice: number | null; discount: number | null; savings: number | null
  rating: number; reviewCount: number; totalSold: number
  images: Array<{ id: string; url: string; alt: string }>
  category: { id: string; name: string; slug: string }
  attributes: Array<{ name: string; value: string }>
  variants: Array<{ id: string; name: string; price: number; stock: number; sku: string }>
  inStock: boolean; stockQuantity: number
  featured: boolean; isBestSeller: boolean; isNew: boolean; isTrending: boolean
  brand: string | null; tags: string[]; suitableFor: string[]
  isPetSafe: boolean | null; isAirPurifying: boolean | null
  difficultyLevel: string | null; weight: number | null
  size: string | null; height: string | null
  deliveryTime: string | null
  prices: Record<string, number> | null
  productType: 'plant' | 'pot' | 'planter' | 'other'
  reviews: Array<{ id: string; rating: number; title?: string; text: string; author: string; avatar?: string; date: string; verified: boolean; helpful: number; images: string[] }>
  relatedProducts: Array<{ id: string; name: string; slug: string; price: number; salePrice: number | null; image: string; rating: number; reviewCount: number; inStock: boolean; featured: boolean }>
  careInstructions: { sunlight: string; watering: string; temperature: string; humidity: string; difficulty: string; height: string; toxicity: string; growthRate?: string; fertilizerSchedule?: string }
  specialFeatures: string[]
  seo: { title: string; description: string }
}

async function fetchProduct(slug: string): Promise<ProductData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
    const res = await fetch(`${baseUrl}/api/products/${slug}`, { next: { revalidate: 3600 } })
    const json = await res.json()
    return json.success ? json.data : null
  } catch { return null }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const data = await fetchProduct(slug)
    if (!data) return { title: 'Product Not Found' }
    return {
      title: data.seo.title,
      description: data.seo.description,
      openGraph: {
        title: data.name,
        description: data.shortDescription || data.name,
        images: data.images[0]?.url ? [{ url: data.images[0].url }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: data.name,
        description: data.shortDescription || data.name,
        images: data.images[0]?.url ? [data.images[0].url] : [],
      },
    }
  } catch { return { title: 'Product' } }
}

function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${s} ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const data = await fetchProduct(slug)
  if (!data) notFound()

  const bundles = [
    { name: 'Plant + Planter', desc: 'Complete ready-to-display set', price: (data.salePrice || data.price) + 299, img: data.images[0]?.url || '' },
    { name: 'Plant + Soil + Fertilizer', desc: 'Everything your plant needs', price: (data.salePrice || data.price) + 199, img: data.images[0]?.url || '' },
    { name: 'Plant + Tray + Spray Bottle', desc: 'Care essentials bundle', price: (data.salePrice || data.price) + 149, img: data.images[0]?.url || '' },
  ]
  const services = [
    { name: 'Plant Installation', desc: 'Expert placement & setup at your home', price: 'Rs 299', icon: '🌿' },
    { name: 'Balcony Garden Setup', desc: 'Complete balcony transformation', price: 'From Rs 999', icon: '🏡' },
    { name: 'Garden Maintenance', desc: 'Regular care by verified gardeners', price: 'From Rs 499/mo', icon: '🌱' },
  ]

  return (
    <>
      <StickyMobileBuyBar
        price={data.price} salePrice={data.salePrice} inStock={data.inStock}
        productId={data.id} productName={data.name} productSlug={data.slug}
        image={data.images[0]?.url || ''} categoryName={data.category.name} categorySlug={data.category.slug}
      />

      <div className="min-h-screen bg-[#FAFAF6] pb-24 lg:pb-16">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#1A6B3C] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href="/shop" className="hover:text-[#1A6B3C] transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href={`/shop?category=${data.category.slug}`} className="hover:text-[#1A6B3C] transition-colors">{data.category.name}</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-900 font-semibold truncate max-w-[200px]">{data.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 py-6 lg:py-10">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ImageGallery images={data.images} productName={data.name} />
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Link href={`/shop?category=${data.category.slug}`}
                        className="text-[11px] font-bold text-[#1A6B3C] uppercase tracking-wider bg-[#F0FAF4] px-2.5 py-1 rounded-full border border-[#BBF7D0]"
                      >
                        {data.category.name}
                      </Link>
                      {data.isNew && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">New</span>
                      )}
                      {data.isTrending && (
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">Trending</span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">{data.name}</h1>
                    {data.shortDescription && (
                      <p className="text-gray-500 mt-2 text-sm sm:text-base">{data.shortDescription}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={data.rating} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">{data.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({data.reviewCount} review{data.reviewCount !== 1 ? 's' : ''})</span>
                  {data.totalSold > 0 && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{data.totalSold}+ sold</span>
                  )}
                  {!data.inStock && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
                  )}
                  {data.inStock && data.stockQuantity <= 5 && data.stockQuantity > 0 && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Only {data.stockQuantity} left</span>
                  )}
                </div>
              </div>

              <ProductPricingPanel
                price={data.price}
                salePrice={data.salePrice}
                discount={data.discount}
                savings={data.savings}
                inStock={data.inStock}
                isBestSeller={data.isBestSeller}
                productId={data.id}
                productName={data.name}
                productSlug={data.slug}
                image={data.images[0]?.url || ''}
                categoryName={data.category.name}
                categorySlug={data.category.slug}
                stockQuantity={data.stockQuantity}
                prices={data.prices}
                productType={data.productType}
              />

              <div className="pt-2">
                <ProductHighlights attributes={data.attributes} careInstructions={data.careInstructions} />
              </div>

              {data.attributes && data.attributes.length > 0 && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Key Features</h3>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    {data.attributes.slice(0, 8).map((attr, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B3C] shrink-0" />
                        <span><strong>{attr.name}:</strong> {attr.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Product</h2>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
              {data.about ? (
                data.about.split('\n').filter(Boolean).map((line: string, i: number) => {
                  const hMatch = line.match(/^## (.+)/)
                  if (hMatch) {
                    return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{hMatch[1]}</h3>
                  }
                  const boldText = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  if (boldText.trim()) {
                    return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: boldText }} />
                  }
                  return null
                })
              ) : data.description ? (
                data.description.split('\n').filter(Boolean).map((para: string, i: number) => (
                  <p key={i} className="mb-3">{para}</p>
                ))
              ) : (
                <p>{data.shortDescription || 'No description available.'}</p>
              )}
            </div>
          </div>

          {data.specialFeatures && data.specialFeatures.length > 0 && (
            <div className="mt-8 lg:mt-12 border-t border-gray-200 pt-8 lg:pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Features</h2>
              <ul className="space-y-3">
                {data.specialFeatures.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 lg:mt-16">
            <CareInstructions instructions={data.careInstructions} />
          </div>

          {data.attributes && data.attributes.length > 0 && (
          <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{data.category.name}</p>
              </div>
              {data.suitableFor && data.suitableFor.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Suitable For</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{data.suitableFor.join(', ')}</p>
                </div>
              )}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Difficulty</p>
                <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{data.difficultyLevel || 'Easy'}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pet Safe</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{data.isPetSafe ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Air Purifying</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{data.isAirPurifying ? 'Yes' : 'No'}</p>
              </div>
              {data.size && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Size</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{data.size}</p>
                </div>
              )}
              {data.height && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Height</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{data.height}</p>
                </div>
              )}
              {data.weight && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Weight</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{data.weight}g</p>
                </div>
              )}
              {data.brand && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Brand</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{data.brand}</p>
                </div>
              )}
              {data.sku && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">SKU</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{data.sku}</p>
                </div>
              )}
            </div>
          </div>
          )}

          <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping & Returns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2 bg-[#F0FAF4] rounded-lg">
                  <Truck className="w-5 h-5 text-[#1A6B3C]" />
                </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">On orders over Rs 499</p>
                    {data.deliveryTime && (
                      <p className="text-xs text-[#1A6B3C] font-medium mt-1">{data.deliveryTime}</p>
                    )}
                  </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2 bg-[#F0FAF4] rounded-lg">
                  <RotateCcw className="w-5 h-5 text-[#1A6B3C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500 mt-1">Damaged plants replaced within 24 hours. Contact us with photos for quick resolution.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2 bg-[#F0FAF4] rounded-lg">
                  <Shield className="w-5 h-5 text-[#1A6B3C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Secure Packaging</p>
                  <p className="text-xs text-gray-500 mt-1">Eco-friendly secure packaging to ensure your plant arrives healthy and safe.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-16">
            <ReviewsSection productSlug={slug} rating={data.rating} reviewCount={data.reviewCount} />
          </div>

          <div className="mt-8 lg:mt-16">
            <ProductFaqSection productName={data.name} attributes={data.attributes} careInstructions={data.careInstructions} />
          </div>

          {data.relatedProducts && data.relatedProducts.length > 0 && (
            <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.relatedProducts.slice(0, 4).map((prod) => (
                  <Link key={prod.id} href={`/product/${prod.slug}`}
                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50 relative">
                      <img src={prod.image || '/placeholder.svg'} alt={prod.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      {prod.featured && (
                        <span className="absolute top-2 left-2 bg-[#1A6B3C] text-white text-[9px] font-bold px-2 py-0.5 rounded">Featured</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-bold text-[#1A6B3C]">Rs {prod.salePrice || prod.price}</span>
                        {prod.salePrice && <span className="text-[11px] text-gray-400 line-through">Rs {prod.price}</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <RatingStars rating={prod.rating} size="sm" />
                        <span className="text-[11px] text-gray-500">({prod.reviewCount})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bundles.map((bundle, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                    <img src={bundle.img} alt={bundle.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 text-sm">{bundle.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{bundle.desc}</p>
                    <p className="text-sm font-bold text-[#1A6B3C] mt-2">Rs {bundle.price}</p>
                    <button className="mt-3 w-full text-xs font-bold text-[#1A6B3C] border border-[#1A6B3C] rounded-lg py-2.5 hover:bg-[#F0FAF4] transition-colors">
                      Add Bundle to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Services</h2>
            <p className="text-gray-500 text-sm mb-6">Let our verified experts help you care for your plants</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map((service, i) => (
                <Link key={i} href="/services"
                  className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="text-3xl">{service.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm mt-3">{service.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{service.desc}</p>
                  <p className="text-sm font-bold text-[#1A6B3C] mt-2">{service.price}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
            <RecentlyViewed currentSlug={slug} />
          </div>
        </div>
      </div>
    </>
  )
}
