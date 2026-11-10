declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const src: any
  export default src
}
