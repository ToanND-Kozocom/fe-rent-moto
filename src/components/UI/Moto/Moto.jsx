import { appConfig } from '@/config/app'
import { useEffect, useState } from 'react'
import { Image } from 'antd'
import { Link } from 'react-router-dom'
import { priceString } from '@/utils/helpers'
import { ROUTES_USER } from '@/config/routes'

const Moto = props => {
  const { moto, className } = props
  const [defaultImageMoto, setDefaultImageMoto] = useState(null)

  useEffect(() => {
    setDefaultImageMoto(appConfig.defaultImageMoto)
  })
  return (
    <Link
      to={ROUTES_USER.MOTO.replace(':id', moto.id)}
      className={`w-96 h-80 flex-col ${className}`}
    >
      <div className="w-full h-80 flex flex-col items-start">
        <Image width={'100%'} height={'80%'} src={moto?.images[0]?.path ?? defaultImageMoto} />
        <p className="text-xl text-red-800 uppercase font-bold">{moto.name}</p>
        <p className="text-xl ">{moto.moto_type.name}</p>
        <p className="">{priceString(moto.price)}</p>
      </div>
    </Link>
  )
}

export default Moto
