import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import jwt from 'js-cookie'
import {createAccessToken} from '../../../utils/generateToken'

connectDB()

export default async (req, res) => {
    try{
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({err: 'LOGIN SEKARANG'})

        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET)
        if(!result) return res.status(400).json({err: 'KOREKSI KEMBALI'}) 

        const user = await Users.findById(result.id)
        if(!user) return res.status(400).json({err: 'USER TIDAK DITEMUKAN'})

        const access_token = createAccessToken({id: user._id})
        res.json({
            access_token,
            user: {
                name : user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        })
    }catch(err){
        return res.status(500).json({err: err.message})
    }
}
