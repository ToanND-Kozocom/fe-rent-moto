import { Alert, Toast } from '@/components/UI'
import { CartContext } from '@/contexts/cart'
import {
  getCart as getCartUtil,
  deleteMotoCart as deleteMotoCartUtil,
  addMotoCart as addMotoUtil,
  deleteOrder as deleteOrderUltil,
} from '@/utils/cart'
import { useEffect, useState } from 'react'

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getCartUtil())

  const getCart = () => {
    setCart(getCartUtil())
  }
  const addMoto = (moto, startDate, endDate) => {
    addMotoUtil(moto, startDate, endDate)
    getCart()
  }

  const deleteMotoCart = moto => {
    deleteMotoCartUtil(moto)
    getCart()
  }

  const deleteOrder = orderId => {
    deleteOrderUltil(orderId)
    getCart()
  }

  const contextValue = {
    cart,
    setCart,
    deleteMotoCart,
    addMoto,
    deleteOrder,
  }
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export default CartProvider
