import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { QualityIcon, DesignIcon, SustainabilityIcon } from "@/components/value-icons"
import { TrackClick } from "@/components/track-click"

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/images/aboutUsHero.jpg"
          alt="Modern living room with elegant furniture and minimalist design"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Main About Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">ABOUT ESSEN</div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-12">YOUR ESSENTIAL LIVING EXPERT</h1>

          <p className="text-muted-foreground leading-relaxed mb-8">
            At Essen, we believe in creating harmonious living spaces that combine superior quality with timeless
            elegance. Specializing in home essentials for young couples in Singapore, our mission is to provide
            furniture and décor that balances beauty and functionality. Each piece in our collection is thoughtfully
            designed to enhance modern living, whether it's a cozy living room setup or a minimalist dining experience.
            Essen is committed to sustainability and innovation, ensuring our products not only elevate homes but also
            respect the environment.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-secondary">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold uppercase mb-6">OUR STORY</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2020, Essen was born from a passion for beautiful, functional living spaces. Our founders,
                having experienced the challenges of furnishing their own homes in Singapore, recognized a gap in the
                market for high-quality, stylish furniture that doesn't compromise on affordability.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The name "Essen" derives from the word "essential," reflecting our philosophy that furniture should be
                both necessary and meaningful. We believe that a well-designed home enhances daily life, creating spaces
                where memories are made and cherished.
              </p>
            </div>
            <div>
              <Image
                src="/images/ourStory.jpeg"
                alt="ESSEN - Your Essential Living Expert"
                width={500}
                height={500}
                className="w-full h-auto rounded-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold uppercase mb-12">OUR VALUES</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <QualityIcon />
                  </div>
                  <h3 className="text-xl font-medium">Quality</h3>
                  <p className="text-muted-foreground">
                    We source only the finest materials and work with skilled craftsmen to ensure every piece meets our
                    exacting standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <DesignIcon />
                  </div>
                  <h3 className="text-xl font-medium">Design</h3>
                  <p className="text-muted-foreground">
                    Our designs blend timeless aesthetics with contemporary functionality, creating pieces that remain
                    relevant for years to come.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <SustainabilityIcon />
                  </div>
                  <h3 className="text-xl font-medium">Sustainability</h3>
                  <p className="text-muted-foreground">
                    We're committed to responsible sourcing and production methods that minimize environmental impact.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Design Philosophy Section */}
      <section className="py-16 bg-secondary">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/designPhilosophy.jpg"
                alt="ESSEN minimalist furniture design with wooden table and cane chairs"
                width={500}
                height={500}
                className="w-full h-auto rounded-md"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-6">DESIGN PHILOSOPHY</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Essen, we believe that good design solves problems while creating beauty. Our design philosophy
                centers on the perfect balance between form and function, ensuring that every piece not only looks
                stunning but also serves its purpose exceptionally well.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We draw inspiration from both Scandinavian minimalism and Asian design sensibilities, creating furniture
                that feels at home in Singapore's unique urban environment. Clean lines, thoughtful details, and
                versatile applications define our collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold uppercase mb-6">OUR COMMITMENT</h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            We're committed to providing an exceptional experience from the moment you discover Essen to the day your
            furniture is delivered and beyond. Our customer service team is dedicated to ensuring your complete
            satisfaction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="text-left">
              <h3 className="text-xl font-medium mb-4">Quality Assurance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every piece undergoes rigorous quality checks before leaving our warehouse. We stand behind our products
                with comprehensive warranties and a satisfaction guarantee.
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-xl font-medium mb-4">Customer Experience</h3>
              <p className="text-muted-foreground leading-relaxed">
                From personalized design consultations to white-glove delivery service, we ensure that your experience
                with Essen is seamless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Showroom Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold uppercase mb-6">VISIT OUR SHOWROOM</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience our furniture in person and speak with our design consultants who can help you create your
            perfect space.
          </p>
          <div className="mt-8">
            <TrackClick eventName="cta_click" eventData={{ location: "about_us", cta_text: "PLAN YOUR VISIT" }}>
              <a href="/visit-us" className="essen-button-secondary bg-white text-primary hover:bg-white/90">
                PLAN YOUR VISIT
              </a>
            </TrackClick>
          </div>
        </div>
      </section>
    </div>
  )
}
