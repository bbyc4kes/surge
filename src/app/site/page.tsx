import Image from 'next/image'
import { pricingCards } from '@/lib/constants'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import clsx from 'clsx'
import { Check } from 'lucide-react'

export default function Home() {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-50" />
      <section className="min-h-full w-full md:pt-44 mt-[-30px] relative flex items-center justify-center flex-col md:mt-12 mb-32">
        <p className="text-center">Run your agency, in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Surge
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-5px]">
          <Image
            src={'/modern-website-design-examples.jpg'}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col md:mt-32 lg:mt-72 gap-4 sm:!mt-20 mt-[-20px]">
        <h2 className="text-4xl text-center">Find Your Perfect Fit</h2>
        <p className="text-muted-foreground text-center">
          Our clear and simple pricing plans are designed to suit your needs.
          Not ready to commit? <br />
          Start for free and explore at your own pace.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx('w-[300px] flex flex-col justify-between', {
                'border-2 border-primary': card.title === 'Unlimited Saas',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    'text-muted-foreground': card.title !== 'Unlimited SaaS',
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>
                  {
                    pricingCards.find((c) => c.title === card.title)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {card.price && card.price}
                </span>
                <span className="text-muted-foreground">
                  <span>/m</span>
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {pricingCards
                    .find((c) => c.title === card.title)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex gap-2">
                        <Check />
                        <p>{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={clsx(
                    'w-full text-center bg-primary p-2 rounded-md text-white',
                    {
                      '!bg-muted-foreground': card.title !== 'Unlimited SaaS',
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
