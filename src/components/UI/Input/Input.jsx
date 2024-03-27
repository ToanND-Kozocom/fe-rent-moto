import { Controller } from 'react-hook-form'

const Input = props => {
  const {
    ref,
    type = 'text',
    label,
    classNameLayout,
    classNameLabel,
    className,
    control,
    name,
    disabled,
    error,
    ...rest
  } = props

  return (
    <div className={classNameLayout}>
      <label className={`font-medium text-gray-900 ${classNameLabel}`} htmlFor={name}>
        {label}
      </label>
      {control ? (
        <Controller
          disabled={disabled}
          control={control}
          name={name || ''}
          render={({ field }) => (
            <input
              type={type}
              id={name}
              className={`border text-gray-900 rounded-lg w-full p-2.5 ${
                error ? 'border-red-500' : 'border-gray-500'
              } ${className}`}
              {...rest}
              {...field}
            />
          )}
        />
      ) : (
        <input
          ref={ref}
          id={name}
          disabled={disabled}
          name={name}
          type={type}
          className={`border text-gray-900 rounded-lg w-full p-2.5 ${
            error ? 'border-red-500' : 'border-gray-500'
          } ${className}`}
          {...rest}
        />
      )}
      {error && <p className="text-red-500 text-xs italic">{error.message ?? ''}</p>}
    </div>
  )
}

export default Input
