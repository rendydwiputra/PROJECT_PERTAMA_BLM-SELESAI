import React, {useContext}from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import { DataContext} from '../store/GlobalState'
import Cookie from 'js-cookie'

function NavBar() {
  const router = useRouter()
const {state, dispatch} = useContext(DataContext)
const {auth, cart} = state

  const isActive = (r) => {
    if(r === router.pathname){
      return " active"
    }else{
      return ""
    }
  }

  const handleLogout = () => {
    Cookie.remove('refreshtoken', {path: 'api/auth/accessToken'})
    localStorage.removeItem('firstLogin')
    dispatch({type: 'AUTH', payload: {} })
    dispatch({type: 'NOTIFY', payload: {success: 'KELUAR AKUN'}})
  }
  const loggedRouter = () => {
    return (
    <li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img src={auth.user.avatar} alt={auth.user.avatar}
    style= {{
      borderRadius: '50%', width: '30px', height: '30px',
      transform: 'translateY(-3px)', marginRight: '3px'
    }}/>
    {auth.user.name}</a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <Link href="/profile">
         <a class="dropdown-item">Profil</a>
         </Link>
         <button class="dropdown-item" onClick={handleLogout}>Log Out</button>
       </div>
   </li>
    )
  }
    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <Link href="/">
    <a className="navbar-brand"><i className="fas fa-store text-danger"></i>LAPAK <s><b className="text-success">GRATIS</b></s></a>
    </Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
    </button>
    <div className= "collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
    <ul className="navbar-nav">
     <li className="nav-item">
     <Link href="/cart">
     <a className={"nav-link" + isActive('/cart')}>
       <i className="fas fa-shopping-cart position-relative" aria-hidden="true">
         <span className="position-absolute" style= {{padding: '3px 6px',
        background: 'red', borderRadius:'50%',top: '-10px',right:'-10px',color:'white',
        fontSize: '12px'}}>{cart.length}</span>
          </i>Keranjang
       </a>
     </Link>
     </li>
     {
       Object.keys(auth).length === 0
       ? <li className="nav-item">
       <Link href="/signin">
       <a className={"nav-link" + isActive('/signin')}>
         <i className="fas fa-user" aria-hidden="true"></i>Sign In
         </a>
       </Link>
       </li>
       : loggedRouter()
     }
    </ul>
  </div>
</nav>
    )
}

export default NavBar
