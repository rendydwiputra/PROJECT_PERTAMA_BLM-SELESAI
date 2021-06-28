import Link from 'next/link'
import { useContext } from 'react' 
import {DataContext} from '../../store/GlobalState'
import {addCart} from '../../store/Actions'

const ProductItem = ({product}) => {
    const {state, dispatch} = useContext(DataContext)
    const {cart} = state
    const userLink = () => {
        return(
            <>
            <Link href= {`product/${product._id}`}>
                <a className="btn btn-info mr-1 flex-fill">Detail Product</a>
            </Link>
            <button className="btn btn-danger mr-1 flex-fill"
            disabled={product.inStock === 0 ? true: false}
            onClick={() => dispatch(addCart(product, cart))}>
                BELI
            </button>
            </>
        )
    }
return (
<div className="card" style={{width: '18rem'}}>
<img className="card-img-top" src={product.images[0].url} alt={product.images[0].url}/>
<div className="card-body">
<h5 className="card-title text-capitalizer" title={product.title}>
    {product.title}
    </h5>
    <div className= "row justify-content-between mx-0">
        <h6 className="text-danger">Rp{product.price}</h6>
        {
            product.inStock > 0
            ? <h6 className="text-danger">Stock :{product.inStock}</h6>
            : <h6 className="text-danger">Stock Habis</h6>
        }
    </div>
<p className="card-text" title={product.description}>
    {product.description}
    </p>
    <div className= "row justify-content-between mx-0">
        {userLink()}
    </div>
</div>
</div>
)
}

export default ProductItem