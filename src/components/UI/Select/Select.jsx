import { Controller } from 'react-hook-form'

const Select = props => {
  const {
    ref,
    label,
    options,
    classNameLayout,
    classNameLabel,
    className,
    control,
    name,
    disabled,
    hasValueZero = false,
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
            <select
              id={name}
              className={`border text-gray-900 rounded-lg w-full p-2.5 ${
                error ? 'border-red-500' : 'border-gray-500'
              } ${className}`}
              {...rest}
              {...field}
            >
              {hasValueZero ? <option value="" /> : null}
              {options?.map(option => {
                const { id, name, value } = option
                return (
                  <option className="border my-2" key={id} value={value ?? id}>
                    {name}
                  </option>
                )
              })}
            </select>
          )}
        />
      ) : (
        <select
          ref={ref}
          id={name}
          disabled={disabled}
          name={name}
          className={`border text-gray-900 rounded-lg w-full p-2.5 ${
            error ? 'border-red-500' : 'border-gray-500'
          } ${className}`}
          {...rest}
        >
          {hasValueZero ? <option value="" /> : null}
          {options?.map(option => {
            const { id, name, value } = option
            return (
              <option className="border my-2" key={id} value={value ?? id}>
                {name}
              </option>
            )
          })}
        </select>
      )}
      {error && <p className="text-red-500 text-xs italic">{error.message ?? ''}</p>}
    </div>
  )
}

export default Select
