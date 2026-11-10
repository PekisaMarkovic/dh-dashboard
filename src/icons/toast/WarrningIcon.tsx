const WarrningIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <g>
        <path
          d="M3.64 28H28.3467C29.3733 28 30.0133 26.8934 29.5067 26L17.1467 4.6667C16.6267 3.77337 15.3467 3.77337 14.84 4.6667L2.48 26C1.97334 26.8934 2.61334 28 3.64 28ZM17.3333 24H14.6667V21.3334H17.3333V24ZM16 18.6667C15.2667 18.6667 14.6667 18.0667 14.6667 17.3334V14.6667C14.6667 13.9334 15.2667 13.3334 16 13.3334C16.7333 13.3334 17.3333 13.9334 17.3333 14.6667V17.3334C17.3333 18.0667 16.7333 18.6667 16 18.6667Z"
          fill="#fff"
        />
      </g>
      <defs>
        <rect width="32" height="32" fill="white" />
      </defs>
    </svg>
  )
}

export default WarrningIcon
