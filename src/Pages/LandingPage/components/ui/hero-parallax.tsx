import React, { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue
} from 'framer-motion'

import { Anime, Manga } from '../../../../types/api'

export const HeroParallax: React.FC<{
  animeProducts: Anime[]
  mangaProducts: Manga[]
}> = ({ animeProducts, mangaProducts }) => {
  const firstRow = animeProducts.slice(0, 5)
  const secondRow = animeProducts.slice(5, 10)
  const thirdRow = mangaProducts.slice(0, 5)
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  )
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  )

  return (
    <div
      ref={ref}
      className='h-[350vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]'
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity
        }}
      >
        <motion.div className='flex flex-row-reverse mb-20 space-x-20 space-x-reverse'>
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className='flex flex-row mb-20 space-x-20'>
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className='flex flex-row-reverse space-x-20 space-x-reverse'>
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header: React.FC = () => {
  return (
    <div className='relative top-0 left-0 w-full px-4 py-20 mx-auto max-w-7xl md:py-40'>
      <h1 className='max-w-xl text-2xl font-bold md:text-7xl dark:text-white'>
        Recommendations Based on Your Mood
      </h1>
      <p className='max-w-2xl mt-8 text-base md:text-xl dark:text-neutral-200'>
        Moodies is a platform that helps you find product recommendations based
        on your mood. We build beautiful products with the latest technology and
        frameworks. We are a team of developers and designers passionate about
        building exceptional products.
      </p>
    </div>
  )
}

interface ProductCardProps {
  product: Anime | Manga
  translate: MotionValue<number>
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  translate
}) => {
  return (
    <motion.div
      style={{
        x: translate
      }}
      whileHover={{
        y: -20
      }}
      key={product.title}
      className='group/product h-96 w-[30rem] relative flex-shrink-0'
    >
      <a
        href={product.url}
        className='block group-hover/product:shadow-2xl'
      >
        <img
          src={product.images.jpg.large_image_url}
          alt={product.title}
          className='absolute inset-0 object-cover object-left-top w-full h-full'
        />
      </a>
      <div className='absolute inset-0 w-full h-full bg-black opacity-0 pointer-events-none group-hover/product:opacity-80'></div>
      <h2 className='absolute text-white opacity-0 bottom-4 left-4 group-hover/product:opacity-100'>
        {product.title}
      </h2>
    </motion.div>
  )
}
