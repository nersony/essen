import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Phone, Clock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Our Showroom | Explore Our Furniture Collections",
    description:
        "Visit our 8,000 sqft showroom featuring premium furniture collections for living, dining, bedroom, and more across three floors. Located in Singapore.",
    alternates: {
        canonical: "https://essen.sg/showroom",
    },
    openGraph: {
        title: "ESSEN Showroom | Your Essential Living Expert",
        description:
            "Explore our three-floor, 8,000 sqft showroom featuring premium furniture collections combining superior quality with timeless elegance.",
        url: "https://essen.sg/showroom",
        images: [
            {
                url: "/images/essen-showroom-og.jpg",
                width: 1200,
                height: 630,
                alt: "ESSEN Singapore Showroom",
            },
        ],
    },
    twitter: {
        title: "ESSEN Showroom | Your Essential Living Expert",
        description:
            "Explore our three-floor, 8,000 sqft showroom featuring premium furniture collections combining superior quality with timeless elegance.",
        images: ["/images/essen-showroom-twitter.jpg"],
    },
}

export default function ShowroomPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section with Video Background */}
            <section className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-black">
                    <div className="relative w-full h-full">
                        <video
                            src="https://assets-singabyte.sgp1.cdn.digitaloceanspaces.com/essen/video/ESSEN%20Showroom.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute w-full h-full object-cover"
                            style={{
                                width: "100%",
                                height: "calc(100% + 120px)", // Extend beyond container to hide any controls space
                                objectFit: "cover",
                                pointerEvents: "none",
                                top: "-60px", // Shift upward to align visual positioning
                                left: "0",
                                border: "none",
                                position: "absolute",
                            }}
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/50 z-10" />
                </div>
                <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl uppercase">Our Showroom</h1>
                    <p className="mt-4 text-xl max-w-xl">
                        Explore our 8,000 sqft showroom featuring premium furniture collections across three floors
                    </p>
                </div>
            </section>

            {/* Showroom Experience & Floor Details Section */}
            <section className="py-16 bg-secondary">
                <div className="container max-w-5xl mx-auto text-center">

                    <p className="text-muted-foreground leading-relaxed mb-12 max-w-4xl mx-auto">
                        At Essen, we believe in creating harmonious living spaces that combine superior quality with timeless
                        elegance. Our three-floor showroom is designed to inspire and help you envision how our furniture can
                        transform your living spaces. Each floor offers a unique experience, showcasing different collections and
                        room settings for young couples in Singapore. Our design consultants are available to provide personalized
                        assistance and expert advice.
                    </p>

                    <Tabs defaultValue="first-floor" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="first-floor">First Floor</TabsTrigger>
                            <TabsTrigger value="second-floor">Second Floor</TabsTrigger>
                            <TabsTrigger value="third-floor">Third Floor</TabsTrigger>
                        </TabsList>

                        {/* First Floor Content */}
                        <TabsContent value="first-floor">
                            <div className="bg-white rounded-lg p-8 shadow-sm">
                                <div className="relative">
                                    {/* Background Image for Essential Living Foundation */}
                                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 bg-black/40" />
                                        <Image
                                            src="/images/essential-living-foundation.jpg"
                                            alt="First Floor Bathroom Fixtures Display"
                                            width={1200}
                                            height={800}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="relative z-10 p-8">
                                        <Badge className="mb-4 bg-primary text-white">Essential Living Foundation</Badge>
                                        <h3 className="text-2xl font-bold mb-4 text-white text-shadow">First Floor: Home Essentials</h3>
                                        <p className="text-white mb-4 max-w-3xl text-shadow font-medium">
                                            Step into our ground floor and immerse yourself in our comprehensive collection of home
                                            essentials. This thoughtfully curated space showcases the foundational elements that transform a
                                            house into a sophisticated home.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Second Floor Content */}
                        <TabsContent value="second-floor">
                            <div className="bg-white rounded-lg p-8 shadow-sm">
                                <div className="relative">
                                    {/* Background Image for Second Floor */}
                                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 bg-black/40" />
                                        <Image
                                            src="/images/second-floor.png"
                                            alt="Second Floor Living and Dining Collections"
                                            width={1200}
                                            height={800}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="relative z-10 p-8">
                                        <Badge className="mb-4 bg-primary text-white">Living & Dining Sanctuaries</Badge>
                                        <h3 className="text-2xl font-bold mb-4 text-white text-shadow">
                                            Second Floor: Living & Dining Collections
                                        </h3>
                                        <p className="text-white mb-4 max-w-3xl text-shadow font-medium">
                                            Ascend to our second floor and discover spaces designed for connection and relaxation. The
                                            centerpiece is our immersive model living room featuring signature sofas complemented by artisanal
                                            coffee tables and cutting-edge entertainment systems.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Third Floor Content */}
                        <TabsContent value="third-floor">
                            <div className="bg-white rounded-lg p-8 shadow-sm">
                                <div className="relative">
                                    {/* Background Image for Third Floor */}
                                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 bg-black/40" />
                                        <Image
                                            src="/images/third-floor.png"
                                            alt="Third Floor Bedroom and Sofa Collections"
                                            width={1200}
                                            height={800}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="relative z-10 p-8">
                                        <Badge className="mb-4 bg-primary text-white">Dream & Relaxation Retreat</Badge>
                                        <h3 className="text-2xl font-bold mb-4 text-white text-shadow">
                                            Third Floor: Bedroom & Extended Sofa Collections
                                        </h3>
                                        <p className="text-white mb-4 max-w-3xl text-shadow font-medium">
                                            The top floor of ESSEN is dedicated to spaces of ultimate relaxation and rejuvenation. Our
                                            expanded premium sofa gallery features designs not found elsewhere in Singapore, alongside our
                                            exquisite collection of bedframes and premium mattresses.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Showroom Experience Section */}
            <section className="py-16">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">WHAT TO EXPECT</div>
                        <h2 className="text-3xl font-bold uppercase mb-4">The ESSEN Experience</h2>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            When you visit our showroom, you'll enjoy a comprehensive furniture shopping experience designed to help
                            you make informed decisions for your home, with exclusive benefits available only in-store.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Free Design Consultation</h3>
                                <p className="text-muted-foreground mb-4">
                                    Our expert design consultants are available on each floor to provide personalized advice and help you
                                    create your perfect living space. They can assist with:
                                </p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-start">
                                        <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                                            1
                                        </span>
                                        <span>Space planning and furniture arrangement</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                                            2
                                        </span>
                                        <span>Color and material selection that matches your style</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                                            3
                                        </span>
                                        <span>Custom furniture options to suit your specific needs</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full">
                                    <Link href="/contact">
                                        Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">In-Store Benefits</h3>
                                <p className="text-muted-foreground mb-4">
                                    Enjoy exclusive benefits available only to our in-store visitors. Take advantage of these special
                                    perks:
                                </p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-start">
                                        <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                                            1
                                        </span>
                                        <span>Complimentary refreshments while you browse</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                                            2
                                        </span>
                                        <span>Exclusive in-store discounts not available online</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                                            3
                                        </span>
                                        <span>$50 off purchases of $500 or more (with appointment made *T&C applies)</span>
                                    </li>
                                </ul>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/visit-us">
                                        Plan Your Visit <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Showroom Information Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Visit Our Showroom</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="h-6 w-6 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold">Location</h3>
                                        <p>
                                            <Link
                                                href="https://maps.app.goo.gl/5YNjVuRRjCyGjNuY7"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                36 Jalan Kilang Barat
                                                <br />
                                                Singapore 159366
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Clock className="h-6 w-6 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold">Opening Hours</h3>
                                        <p>Operating Daily: 11am-8pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Phone className="h-6 w-6 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold">Contact</h3>
                                        <p>
                                            Whatsapp:{" "}
                                            <Link
                                                href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                                                className="hover:underline"
                                            >
                                                +65 6019 0775
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                    <Link href="https://maps.app.goo.gl/5YNjVuRRjCyGjNuY7" target="_blank" rel="noopener noreferrer">
                                        Get Directions
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="map-container h-[300px] rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7982326290084!2d103.80229491475403!3d1.2896110990636652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1bd0af54a8c9%3A0x7c70de73c54ea256!2s36%20Jalan%20Kilang%20Barat%2C%20Singapore%20159366!5e0!3m2!1sen!2ssg!4v1650000000000!5m2!1sen!2ssg"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="ESSEN Furniture Store Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-secondary">
                <div className="container max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold uppercase mb-6 text-foreground">Ready to Transform Your Home?</h2>
                    <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
                        Visit our showroom today to experience our furniture collection in person and take advantage of exclusive
                        in-store offers. Just 5 minutes from downtown Singapore.
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg">
                            <Link href="/visit-us">PLAN YOUR VISIT</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
