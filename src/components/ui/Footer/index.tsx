const Footer = () => {
  return (
    <div className='flex justify-between w-full gap-5 p-5 text-xs uppercase text-secondary-foreground bg-background'>
      <a href='https://github.com/Araryarch/Moodies'>
        <h1>moodies: 2024</h1>
      </a>
      <h1>
        BY:{' '}
        <a
          href='https://github.com/Araryarch'
          className='cursor-pointer'
        >
          ARARYA
        </a>{' '}
        AND{' '}
        <a
          href='https://github.com/FHPeople'
          className='cursor-pointer'
        >
          THIYA
        </a>
      </h1>
    </div>
  )
}

export default Footer
