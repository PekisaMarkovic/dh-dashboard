export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  type: 'WHITE' | 'DARK'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Logo = ({ type, ...rest }: LogoProps) => {
  const color = type === 'WHITE' ? '#fff' : '#334155'

  return (
    <svg width="90" height="48" viewBox="0 0 90 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <text x="0" y="40" fill={color} fontFamily="Poppins, Helvetica, Arial, sans-serif" fontSize="44" fontWeight="800" letterSpacing="2">
        DH
      </text>
    </svg>
  )
}

export default Logo
