import { cn } from '../../../lib/utils'
import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn
} from '@tabler/icons-react'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <BentoGrid className='mx-auto md:auto-rows-[20rem]'>
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn('[&>p:text-lg]', item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  )
}

export default About

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  }
  const variantsSecond = {
    initial: {
      x: 0
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      initial='initial'
      whileHover='animate'
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2'
    >
      <motion.div
        variants={variants}
        className='flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black'
      >
        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500' />
        <div className='w-full h-4 bg-gray-100 rounded-full dark:bg-neutral-900' />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className='flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black'
      >
        <div className='w-full h-4 bg-gray-100 rounded-full dark:bg-neutral-900' />
        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500' />
      </motion.div>
      <motion.div
        variants={variants}
        className='flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black'
      >
        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500' />
        <div className='w-full h-4 bg-gray-100 rounded-full dark:bg-neutral-900' />
      </motion.div>
    </motion.div>
  )
}
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0
    },
    animate: {
      width: '100%',
      transition: {
        duration: 0.2
      }
    },
    hover: {
      width: ['0%', '100%'],
      transition: {
        duration: 2
      }
    }
  }
  const arr = new Array(6).fill(0)
  return (
    <motion.div
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2'
    >
      {arr.map((_, i) => (
        <motion.div
          key={'skelenton-two' + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + '%'
          }}
          className='flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4'
        ></motion.div>
      ))}
    </motion.div>
  )
}
const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: '0 50%'
    },
    animate: {
      backgroundPosition: ['0, 50%', '100% 50%', '0 50%']
    }
  }
  return (
    <motion.div
      initial='initial'
      animate='animate'
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2'
      style={{
        background:
          'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%'
      }}
    >
      <motion.div className='w-full h-full rounded-lg'></motion.div>
    </motion.div>
  )
}
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5
    },
    hover: {
      x: 0,
      rotate: 0
    }
  }
  const second = {
    initial: {
      x: -20,
      rotate: 5
    },
    hover: {
      x: 0,
      rotate: 0
    }
  }
  return (
    <motion.div
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2'
    >
      <motion.div
        variants={first}
        className='h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center'
      >
        <img
          src='https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg'
          alt='avatar'
          height='100'
          width='100'
          className='w-10 h-10 rounded-full'
        />
        <p className='mt-4 text-xs font-semibold text-center sm:text-sm text-neutral-500'>
          I think i just be better after use this website
        </p>
        <p className='border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4'>
          Marah
        </p>
      </motion.div>
      <motion.div className='h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center'>
        <img
          src='https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg'
          alt='avatar'
          height='100'
          width='100'
          className='w-10 h-10 rounded-full'
        />
        <p className='mt-4 text-xs font-semibold text-center sm:text-sm text-neutral-500'>
          I Love this website this is so cool
        </p>
        <p className='border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4'>
          Senang
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className='h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center'
      >
        <img
          src='https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg'
          alt='avatar'
          height='100'
          width='100'
          className='w-10 h-10 rounded-full'
        />
        <p className='mt-4 text-xs font-semibold text-center sm:text-sm text-neutral-500'>
          I love Anime as specialy one piece
        </p>
        <p className='border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4'>
          Baik
        </p>
      </motion.div>
    </motion.div>
  )
}
const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  }
  const variantsSecond = {
    initial: {
      x: 0
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      initial='initial'
      whileHover='animate'
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2'
    >
      <motion.div
        variants={variants}
        className='flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black'
      >
        <img
          src='https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg'
          alt='avatar'
          height='100'
          width='100'
          className='w-10 h-10 rounded-full'
        />
        <p className='text-xs text-neutral-500'>
          There a lot of anime that u can watch the trailer or manga that you
          can read the synopsys.
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className='flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black'
      >
        <p className='text-xs text-neutral-500'>One Piece is Real ?</p>
        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500' />
      </motion.div>
    </motion.div>
  )
}

const items = [
  {
    title: 'Mood-based Anime Recommendations',
    description: (
      <span className='text-sm'>
        Let our AI chatbot analyze your mood and recommend the perfect anime.
      </span>
    ),
    header: <SkeletonOne />,
    className: 'md:col-span-1',
    icon: <IconClipboardCopy className='w-4 h-4 text-neutral-500' />
  },
  {
    title: 'Personalized Anime Suggestions',
    description: (
      <span className='text-sm'>
        Our AI provides anime suggestions tailored to how you're feeling.
      </span>
    ),
    header: <SkeletonTwo />,
    className: 'md:col-span-1',
    icon: <IconFileBroken className='w-4 h-4 text-neutral-500' />
  },
  {
    title: 'Contextual Anime Discovery',
    description: (
      <span className='text-sm'>
        Based on your mood, our AI curates anime that fits your emotional vibe.
      </span>
    ),
    header: <SkeletonThree />,
    className: 'md:col-span-1',
    icon: <IconSignature className='w-4 h-4 text-neutral-500' />
  },
  {
    title: 'Sentiment-Driven Anime Picks',
    description: (
      <span className='text-sm'>
        Understand your mood better and discover anime that matches your
        sentiment.
      </span>
    ),
    header: <SkeletonFour />,
    className: 'md:col-span-2',
    icon: <IconTableColumn className='w-4 h-4 text-neutral-500' />
  },

  {
    title: 'Instant Mood Analysis',
    description: (
      <span className='text-sm'>
        Our chatbot instantly analyzes your mood to provide anime that suits how
        you feel.
      </span>
    ),
    header: <SkeletonFive />,
    className: 'md:col-span-1',
    icon: <IconBoxAlignRightFilled className='w-4 h-4 text-neutral-500' />
  }
]
