const Button = props => {
  const { children, type, className, ...rest } = props

  return (
    <button
      {...rest}
      type={type}
      className={`whitespace-nowrap flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
