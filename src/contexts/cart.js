import React, { useContext } from 'react'

export const CartContext = React.createContext(null)

export const useCart = () => useContext(CartContext)
