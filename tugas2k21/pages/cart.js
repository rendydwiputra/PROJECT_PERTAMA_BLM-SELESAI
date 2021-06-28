import Head from 'next/head'
import { useContext, useState, useEffect} from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'
import CartItem from '../component/CartItem'
import { getData } from '../utils/fetchData'

const cart = () => {
    const {state, dispatch} = useContext(DataContext)
    const {cart, auth} = state
    const [total, setTotal]=useState(0)
    const [address, setAddress]=useState('')
    const [mobile, setMobile]=useState('')
    const [payment, setPayment] = useState (false)

    useEffect(() => {
        const getTotal = () => {
            const res = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            },0)

            setTotal(res)
        }
        getTotal()
    },[cart])


    useEffect(() => {
        const cartLocal = JSON.parse(localStorage.getItem('_LAPAK_GRATIS_KERANJANG_'))
        if(cartLocal && cartLocal.length > 0) {
            let newArr = []
            const updateCart = async () => {
                for (const item of cartLocal){
                    const res = await getData(`product/${item._id}`)
                    const {_id, title, images, price, inStock} = res.product
                    if(inStock > 0) {
                        newArr.push({_id, title, images, price, inStock,
                        quantity: item.quantity > inStock ? 1 : item.quantity})
                    }
                }

                dispatch({ type: 'ADD_CART', payload: newArr})
            }
            updateCart()
        }
    },[])

    const handlePayment = () => {
        if(!address || !mobile)
        return dispatch({type: 'NOTIFY', payload: {error : 'Masukan Alamat dan Nomor!'}})
        setPayment(true)
    }

    if(cart.length === 0) return <img className="img-responsive w-100" src="/1.png" alt="Keranjang Kosong"/>
    return(
        <div className="row mx-auto">
            <Head>
                <title>Halaman Keranjang</title>
            </Head>
            <div className="col-mid-8 text-secondary table-responsive my-3">
                <h2 className="text-uppercase">Keranjang Belanja</h2>
                <table className= "table my-3">
                    <tbody>
                        {
                            cart.map(item =>(
                                <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className= "col-md-4 my-3 text-left text-uppercase text-secondary">
                <form>
                    <h2>Validasi Pembelian</h2>
                    <label htmlFor="address">ALAMAT</label>
                    <input type="text" name="address" id="address"
                    className= "form-control mb-2" value={address} 
                    onChange={e => setAddress(e.target.value)}/>

                    <label htmlFor="mobile">NOMOR</label>
                    <input type="text" name="mobile" id="mobile"
                    className= "form-control mb-2" value={mobile} 
                    onChange={e => setMobile(e.target.value)}/>
                </form>
                <h3>Total Harga : <span className="text-success">Rp{total}</span></h3>

                <Link href={auth.user ? '#!' : '/signin'}>
                <a className= "btn btn-dark my-2" onClick={handlePayment}>ORDER (COD)</a>
                </Link>
            </div>
        </div>
    )
}

export default cart