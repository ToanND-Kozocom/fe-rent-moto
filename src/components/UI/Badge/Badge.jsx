const Badge = props => {
  const { children, className, ...rest } = props

  return (
    <span
      {...rest}
      className={`${className} text-gray-900 text-x font-medium me-2 px-2.5 py-0.5 rounded`}
    >
      {children}
    </span>
  )
}

export default Badge
