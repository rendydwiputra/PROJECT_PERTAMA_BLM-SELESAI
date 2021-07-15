const Toast = ({msg, handleShow, bgColor}) => {
    return(
    <div className={`toast show position-fixed text-light ${bgColor}`} 
    style={{ top: '5px', right: '5px', zIndex: 9, minWidth: '270px'}}>
   
    <div className={`toast-header ${bgColor} text-light`}>
    <strong className="mr-auto text-light">{msg.title}</strong>
    <small className="text-muted">5 mins ago</small>
    <button type="button" className="ml-2 mb-1 closetext-light" 
    data-dismiss="toast" style={{ outline: 'none', background: 'none',
    border: 'none'}} onClick={handleShow}>&times;</button>
    </div>
    <div className="toast-body">{msg.msg}
    </div>
    </div>
    )
}

export default Toast