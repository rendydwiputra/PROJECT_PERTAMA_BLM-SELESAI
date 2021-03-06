import Head from 'next/head'
import {useState, useContext, useEffect} from 'react'
import {DataContext} from '../../store/GlobalState'
import {imageUpload} from '../../utils/imageUpload'
import {postData, getData, putData} from '../../utils/fetchData'
import {useRouter} from 'next/router'

const ProductsManager = () => {
    const initialState = {
        title: '',
        price: 0,
        inStock: 0,
        description: '',
        content: '',
        category: ''
    }
    const [product,setProduct] = useState(initialState)
    const {title, price, inStock, description, content, category} = product

    const [images, setImages] = useState ([])

    const {state, dispatch} = useContext(DataContext)
    const {auth} = state

    const router = useRouter()
    const {id} = router.query
    const [onEdit, setOnEdit]  = useState(false)

    useEffect(() => {
        if(id){
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                setProduct(res.product)
                setImages(res.product.images)
            })
        }else{
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
        }
    },[id])

    const handleChangeInput = e => {
        const {name, value} = e.target
        setProduct({...product, [name]: value})
        dispatch ({type: 'NOTIFY', payload: {}})
    }
    const handleUploadInput = e => {
        dispatch({type: 'NOTIFY', payload: {}})
        let newImages = []
        let num = 0
        let err = ''
        const files = [...e.target.files]
        
        if(files.length === 0) 
        return dispatch({type: 'NOTIFY', payload: {error: 'Tidak Ada File'}})
        files.forEach (file => {
            if(file.size > 6000 * 4000)
            return err = 'File Terlalu Besar'

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return err = 'Format File Tidak DiDukung'

            num += 1;
            if(num <=5) newImages.push(file)
            return newImages;
        })
        if(err) dispatch({type: 'NOTIFY', payload: {error: err}})

        const imgCount = images.length
        if(imgCount + newImages.length > 5)
        return dispatch({type: 'NOTIFY', payload: {error: 'Max 5 Gambar'}})
        setImages([...images, ...newImages])

    }

    const deleteImages = index => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(auth.user.role !== 'admin')
        return dispatch ({type: 'NOTIFY', payload: {error: 'Tidak Valid'}})

        if(!title || !price || !inStock || !description || !content || category === 'all' || images === 0)
        return dispatch({type: 'NOTIFY', payload: {error: 'Isi Semua Kolom'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
        let media = []
        const imgNewURL = images.filter(img => !img.url)
        const imgOldURL = images.filter(img => img.url)

        if(imgNewURL.length > 0 ) media = await imageUpload(imgNewURL)

        let res;
        if(onEdit){
            res = await putData(`product/${id}`, {...product, images: [...imgOldURL, ...media]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        }else{
            res = await postData('product', {...product, images: [...imgOldURL, ...media]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    return (
        <div className="products_manager">
            <Head>
                <title>Create Product</title>
            </Head>
            <form className="row" onSubmit={handleSubmit}>
                <div className= "col-md-6">

                    <input type="text" name="title" value={title}
                    placeholder="Title" className="d-block my-4 w-100 p-2" 
                    onChange={handleChangeInput} />

                <div className="row">
                    <div className="col-sm-6">
                    <label htmlFor="price">Harga</label>
                        <input type="number" name="price" value={price}
                        placeholder="Harga" className="d-block my-4 w-100 p-2" 
                        onChange={handleChangeInput} />
                    </div>
                    <div className="col-sm-6">
                    <label htmlFor="price">Stock</label>
                        <input type="number" name="inStock" value={inStock}
                        placeholder="Stock" className="d-block my-4 w-100 p-2" 
                        onChange={handleChangeInput} />
                    </div>
                    </div>
                    <textarea name="description" id="description" cols="30" rows="4" 
                    placeholder="Description" onChange={handleChangeInput} 
                    className="d-block my-4 w-100 p-2" value={description}/>

                    <textarea name="content" id="content" cols="30" rows="6" 
                    placeholder="Content" onChange={handleChangeInput} 
                    className="d-block my-4 w-100 p-2" value={content}/>

                    <div className="input-group-prepend px-0 my-2">
                    <input type="text" name="category" value={category}
                    placeholder="category" className="d-block my-4 w-100 p-2" 
                    onChange={handleChangeInput} />
                    </div>
                    <button type="submit" className="btn btn-success my-2 px-4">{onEdit ? 'Edit Product' : 'Create Product'}</button>
                </div>
                <div className= "col-md-6 my-4">
                    <div className ="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file border rounded">
                            <input type="file" className="custom-file-input"
                            onChange={handleUploadInput} multiple/>
                        </div>
                    </div>
                    <div className="row img-up mx-0">
                        {
                            images.map((img, index) => (
                                <div key={index} className="file_img my-2">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)}
                                    alt="" className="img-thumbnail rounded"/>

                                    <span onClick={() => deleteImages(index)}>x</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProductsManager