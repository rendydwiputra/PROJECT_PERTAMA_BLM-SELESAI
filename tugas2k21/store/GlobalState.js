import { createContext, useReducer, useEffect } from 'react'
import reducers from './Reducers'
import {getData} from '../utils/fetchData'


export const DataContext = createContext()


export const DataProvider = ({children}) => {
    const initialState = {notify: {}, auth: {}, cart: [], modal: {}, categories:[]}
    const [state, dispatch] = useReducer(reducers, initialState)
    const {cart} = state

    useEffect(()=>{
        const firstLogin = localStorage.getItem("firstLogin")
        if(firstLogin){
            getData('auth/accessToken').then(res => {
                if(res.err) return localStorage.removeItem("firstLogin")

                dispatch({
                    type: "AUTH",
                    payload: {
                        token:res.access_token,
                        user: res.user
                    }
                })
            })
        }
    },[])

    useEffect(() => {
        const _LAPAK_GRATIS_KERANJANG_ = JSON.parse (localStorage.getItem('_LAPAK_GRATIS_KERANJANG_'))
        if(_LAPAK_GRATIS_KERANJANG_) dispatch({type:'ADD_CART', payload: _LAPAK_GRATIS_KERANJANG_})
    }, [])

    useEffect(() => {
        localStorage.setItem('_LAPAK_GRATIS_KERANJANG_', JSON.stringify(cart))
    }, [cart])
    return(
        <DataContext.Provider value= {{state, dispatch}}>
            {children}
        </DataContext.Provider>
    )
}