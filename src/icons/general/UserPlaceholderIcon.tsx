const UserPlaceholderIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 32 32" // Updated to reflect the new 32x32 coordinate system
      xmlSpace="preserve"
      width="32px"
      height="32px"
      {...props}
    >
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: '\n\t.st0{fill:#EBEBEB;}\n\t.st1{fill:#FFFFFF;}\n',
        }}
      />
      <g>
        <circle className="st0" cx={16} cy={16} r={16} /> {/* Updated to center and scale the circle */}
        <path
          className="st1"
          d="M25.93,27.73c-0.73-1.8-2.13-2.6-3.73-3.47c-0.8-0.47-1.6-0.93-2.27-1.73c-0.67-0.87-1-1.93-1-3.2
      c0-0.07,0-0.2,0.07-0.27c1.33-1.6,2.2-4.4,2.2-7.07c0-1.47-0.47-2.73-1.33-3.6c-0.93-0.93-2.2-1.47-3.87-1.4h0
      c-1.67,0-2.93,0.47-3.87,1.4c-0.87,0.87-1.33,2.2-1.33,3.6c0,2.67,0.87,5.73,2.2,7.07c0.07,0.07,0.07,0.13,0.07,0.27
      c0,1.27-0.33,2.33-1,3.2c-0.67,0.8-1.47,1.27-2.27,1.73c-1.6,0.93-3,1.67-3.73,3.47l-0.2,0.6l0.33,0.27
      C8.67,30.8,12.47,32,16,32c3.53,0,7.27-1.2,9.8-3.4l0.4-0.33L25.93,27.73z"
        />
      </g>
    </svg>
  )
}

export default UserPlaceholderIcon
