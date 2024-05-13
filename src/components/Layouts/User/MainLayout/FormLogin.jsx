import { Button, Input, Toast } from '@/components/UI'
import { useAuthUser } from '@/contexts/authUser'
import { useLoading } from '@/contexts/loading'
import useHandleError from '@/hooks/useHandleError'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { setErrorForInput } from '@/utils/handleErrors'

const FormLogin = props => {
  const { setIsOpenModalLogin } = props
  const defaultValues = {
    email: '',
    password: '',
  }
  const [typePassword, setTypePassword] = useState('password')
  const { showLoading, hideLoading } = useLoading()
  const { handleResponseError } = useHandleError()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: defaultValues,
  })
  const { email: emailError, password: passwordError } = errors

  const { authUserToken, authUserLogin } = useAuthUser()
  const onSubmit = fields => {
    showLoading()
    authUserLogin(fields)
      .then(() => {
        reset(defaultValues)
        setIsOpenModalLogin(false)
        Toast.success('Login successful')
      })
      .catch(err => {
        if (err.response.status == 422) {
          setErrorForInput(err, setError)
        } else {
          handleResponseError(err)
        }
      })
      .finally(() => {
        hideLoading()
      })
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div>
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  control={control}
                  error={emailError}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="relative">
                <Input
                  type={typePassword}
                  name="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  control={control}
                  error={passwordError}
                />
                <button
                  className="absolute right-2 top-2"
                  type="button"
                  onClick={() => setTypePassword(typePassword == 'password' ? 'text' : 'password')}
                >
                  {typePassword == 'text' ? (
                    <i className="fa-sharp fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-sharp fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{' '}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormLogin
