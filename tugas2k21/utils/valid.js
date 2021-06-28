const valid = (name, email, password, cf_password) => {
    if (!name || !email || !password)
    return 'ISI SEMUA KOLOM.'

    if(!validateEmail(email))
    return 'E,MAIL TIDAK VALID'

    if(password.length < 6)
    return 'PASSWORD HARUS 6 KARAKTER.'

    if(password !== cf_password)
    return 'KONFIRMASI PASSWORD.'
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

export default valid