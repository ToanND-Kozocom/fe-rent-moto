import { Alert, Toast } from '@/components/UI'
import state from '@/utils/localStorage'

export const addMotoCart = (moto, startDate, endDate) => {
  moto = {
    ...moto,
    cartId: Date.now().toString(),
  }
  const orders = getCart()
  let check = false
  let newOrders = orders.map(order => {
    if (order.startDate == startDate && order.endDate == endDate) {
      if (order.motos.find(item => item.id == moto.id)) {
        Toast.error('Has been')
        check = true
        return order
      }
      order.motos = [...order.motos, moto]
      check = true
      return order
    }
    return order
  })
  if (check === false) {
    newOrders = [
      ...orders,
      {
        startDate: startDate,
        endDate: endDate,
        motos: [moto],
        cartId: 'cart-' + Date.now().toString(),
      },
    ]
  }
  Alert.notifications('Thêm vào giỏ hàng thành công', 'success')
  saveCart(newOrders)
}

export const saveCart = orders => {
  state.setState('carts', orders ?? [])
}

export const getCart = () => {
  return state.getState('carts') ?? []
}

export const deleteMotoCart = motoDelete => {
  const cart = getCart()
  const newCart = cart
    .map(item => {
      item.motos = item.motos.filter(moto => {
        return moto.cartId !== motoDelete.cartId
      })
      return item
    })
    .filter(item => {
      return item.motos.length > 0
    })

  // console.log(newCart)
  saveCart(newCart)
}

export const getOrderCartById = id => {
  const cart = getCart()
  return cart.find(order => order.cartId === id)
}

export const deleteOrder = id =>{
  const cart = getCart()
  const newCart = cart.filter(order => order.cartId !== id)
  saveCart(newCart)
}
