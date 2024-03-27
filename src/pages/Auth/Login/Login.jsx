import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useLoading } from '@/contexts/loading'
import { useAuth } from '@/contexts/auth'
import { ROUTES_ADMIN } from '@/config/routes'
import useHandleError from '@/hooks/useHandleError'
import { Input, Button } from '@/components/UI'

const defaultValues = {
  email: '',
  password: '',
}

const Login = () => {
  const { showLoading, hideLoading } = useLoading()
  const { authToken, authLogin } = useAuth()
  const { handleResponseError } = useHandleError()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  })

  const { email: emailError, password: passwordError } = errors

  const login = data => {
    showLoading()
    authLogin(data)
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  useEffect(() => {
    if (authToken) {
      navigate(ROUTES_ADMIN.DASHBOARD, { replace: true })
    }
  }, [authToken])

  // return (
  //   <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
  //     <div className="p-2 rounded-none md:rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg w-screen h-screen sm:w-[30rem] sm:h-auto">
  //       <div className="bg-white p-10 rounded-lg shadow-2xl w-full h-full">
  //         <form className="space-y-6" onSubmit={handleSubmit(login)}>
  //           <h2 className="text-center text-3xl font-bold text-gray-800">ĐĂNG NHẬP</h2>
  //           <Input
  //             label="Email"
  //             placeholder="Email"
  //             name="email"
  //             control={control}
  //             errors={emailError}
  //           />
  //           <div className="relative">
  //             <Input
  //               label="Mật khẩu"
  //               type={showPassword ? 'text' : 'password'}
  //               placeholder="Mật khẩu"
  //               name="password"
  //               control={control}
  //               errors={passwordError}
  //             />
  //             <button
  //               type="button"
  //               className="absolute bottom-0 right-0 px-4 py-2.5 text-lg"
  //               onClick={() => setShowPassword(prev => !prev)}
  //             >
  //               <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
  //             </button>
  //           </div>
  //           <Button type="submit" className="w-full">
  //             Đăng nhập
  //           </Button>
  //           <div className="!mt-2 flex justify-between">
  //             <Link className="text-blue-500 hover:text-blue-800 text-sm" href="#">
  //               Đăng ký tài khoản
  //             </Link>
  //             <Link className="text-blue-500 hover:text-blue-800 text-sm" href="#" to="/product">
  //               Quên mật khẩu?
  //             </Link>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Toanf shop
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit(login)}>
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <Input
                  for="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  name="email"
                  control={control}
                  error={emailError}
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <Input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="password"
                  name="password"
                  control={control}
                  error={passwordError}
                />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-start"></div>
                <a
                  href="#"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login
              </Button>

              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <a
                  href="#"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
