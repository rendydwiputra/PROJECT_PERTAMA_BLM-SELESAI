import '../styles/globals.css'
import Layout from '../component/Layout'
import {DataProvider} from '../store/GlobalState'

function MyApp({ Component, pageProps }) {
  return(
    <DataProvider>
    <Layout>
      <Component {...pageProps}/>
    </Layout>
    </DataProvider>
  )
  }

  export default MyApp
