import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';
import _, { random } from "lodash";

Modal.setAppElement('#app')
const App = () => {

    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [totalItem, setTotalItem] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [totalPaid, setTotalPaid] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const loadProducts = async() => {
        const res = await axios.get("api/products");
        setProducts(res.data);
    }

    const addToCart = async(item) => {
        setTotalItem(totalItem + 1);
        setSubtotal(subtotal + item.price_cents)
        let indexOfItemInCart = await cartItems.findIndex(x => x.id === item.id);

        if(indexOfItemInCart !== -1) {
            let updatedItem;
            let newCart = [];
            cartItems.forEach(cartItem => {
                if(cartItem.id === item.id) {
                    updatedItem = {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                        totalCost: cartItem.price_cents * (cartItem.quantity + 1)
                    }
                    newCart.push(updatedItem);
                }
                else {
                    newCart.push(cartItem);
                }
            }) 
            setCartItems(newCart);
        }
        else {
            let newItem = {
                ...item,
                quantity: 1,
                totalCost: item.price_cents
            }
            setCartItems([...cartItems, newItem]);
        }
    }

    const increaseQty = async(item) => {
        let indexOfItemInCart = await cartItems.findIndex(x => x.id === item.id);
        let newCart = _.cloneDeep(cartItems);
        let updateItem = newCart[indexOfItemInCart]
        updateItem.quantity += 1;
        updateItem.totalCost = updateItem.price_cents * updateItem.quantity;
        setTotalItem(totalItem + 1);
        setSubtotal(subtotal + item.price_cents)
        setCartItems(newCart);
    }

    const decreaseQty = (item) => {
        let indexOfItemInCart = cartItems.findIndex(x => x.id === item.id);
        let newCart = _.cloneDeep(cartItems);
        let updateItem = newCart[indexOfItemInCart]
        updateItem.quantity -= 1;
        if(updateItem.quantity <= 0) {
            newCart.splice(indexOfItemInCart, 1)
        } 

        updateItem.totalCost = updateItem.price_cents * updateItem.quantity;
        console.log(updateItem.totalCost);
        setTotalItem(totalItem - 1);
        setSubtotal(subtotal - item.price_cents)
        setCartItems(newCart);
    }

    const cancel = () => {
        setCartItems([])
        setSubtotal(0)
        setTotalItem(0)
    }

    const checkout = () => {
        if(cartItems.length === 0) {
            alert('Please add item into cart before checkout.')
        }
        else {
            setModalIsOpen(true)
        }
        let randomInteger = Math.floor(Math.random() * (((subtotal / 100) + 10) - ((subtotal / 100) + 1) + 1)) + ((subtotal / 100) + 1)
        setTotalPaid(subtotal / 100 + randomInteger);
    }

    const submit = async() => {
        await axios.post("api/order", {
            cartItem: cartItems,
            tax: 6,
            service_charge: 0,
            total_amount_cents: subtotal * 1.06,
            is_walkin: paymentMethod === 'cash' ? true : false,
            payment_method: paymentMethod,
            paid_amount_cents: totalPaid
        })
        .then((res) => {
            setModalIsOpen(false);
            cancel()
            alert('Order Created')
        });

    }

    useEffect(() => {
        loadProducts();
    }, [])

    return(
        <div className="row ml-3">
            <div className="cashier col align-items-center justify-content-center text-center">
                <div className=" mb-3">
                    <div className="col">POS <br /> Cashier</div>
                </div>
                <table className="table">
                    <thead className="align-middle">
                        <tr>
                            <th>Product</th>
                            <th>Price <br /> (RM)</th>
                            <th>Quantity</th>
                            <th>Cost  <br /> (RM)</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {cartItems.length !== 0 ? (cartItems.map((item, key) =>
                            <tr key={key}>
                                <td>{item.name.toUpperCase()}</td>
                                <td>{item.price_cents/100}</td>
                                <td>
                                    <button className="px-2 rounded-circle me-3" onClick={() => decreaseQty(item)}>&minus;</button>
                                    {item.quantity}
                                    <button className="px-2 rounded-circle ms-3" onClick={() => increaseQty(item)}>+</button>
                                </td>
                                <td>{item.totalCost / 100}</td>
                            </tr>
                        )) :
                        (<tr></tr>)
                        }
                    </tbody>
                </table>
                {cartItems.length === 0 ? (
                        <div className=" m-4 mb-5">
                            No Item
                        </div>
                    ) : (<div></div>)}
                <div className="row">
                    <div className="m-2">
                        <label className="col-6">Subtotal</label>
                        <label className="col-6">RM {(subtotal / 100).toFixed(2)}</label>
                    </div>
                    <div className="m-2">
                        <label className="col-6">No. of items</label>
                        <label className="col-6">{totalItem}</label>
                    </div>
                    <div className="m-2">
                        <label className="col-6">Tax</label>
                        <label className="col-6">6%</label>
                    </div>
                    <div className="m-2">
                        <label className="col-6">Service Charge</label>
                        <label className="col-6">-</label>
                    </div>
                    <hr className="mt-2"/>
                    <div className="m-2">
                        <label className="col-6">Total</label>
                        <label className="col-6">RM {(subtotal * 1.06 / 100).toFixed(2)}</label>
                    </div>
                </div>
                

                <div className="col mt-5">
                    <button className="col-3 btn btn-danger me-5 p-4 px-5" onClick={() => cancel()}>Cancel</button>
                    <button className="col-3 btn btn-primary me-5 p-4 px-5" onClick={() => checkout()}>Check Out</button>
                </div>

            </div>
            <div className="col-1 vr p-1 ms-5"></div>
            <div className="products col text-center">
                <div className="col m-4">Products</div>
                <div className="col">
                    <div className="row">
                        {products.map((product, key) =>
                            <div key={key} className="col-4 w-50 mb-5 pb-5">
                                <div onClick={() => addToCart(product)}>
                                    <button className="col-7 mx-5 px-5 py-4">{product.name.toUpperCase()}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal 
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    overlay: {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.75)'
                    },
                    content: {
                      fontSize: '40px',
                      textAlign: 'center',
                      position: 'absolute',
                      top: '40px',
                      left: '40px',
                      right: '40px',
                      bottom: '40px',
                      border: '1px solid #ccc',
                      background: '#fff',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '20px'
                    }
                  }}
                >
                <div className="m-2 mt-5 pt-5">
                        <label className="col-6">Total Paid Amount</label>
                        <label className="col-6">RM {totalPaid.toFixed(2)}</label>
                </div>
                <div className="m-2">
                        <label className="col-6">Total</label>
                        <label className="col-6">RM {subtotal * 1.06 / 100}</label>
                </div>
                <div className="m-2">
                        <label className="col-6">Payment Method</label>
                        <select id="paymentMethod" className="col-6 p-3 text-center" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="cash">Cash</option>
                            <option value="online banking">Online Banking</option>
                        </select>
                </div>
                <div className="m-2">
                        <label className="col-6">Change</label>
                        <label className="col-6">RM {(totalPaid - (subtotal * 1.06) / 100).toFixed(2)}</label>
                </div>
                <button className="col-3 m-5 mx-5" onClick={() => setModalIsOpen(false)}>Close</button>
                <button className="col-3 m-5 mx-5" onClick={() => submit()}>Submit</button>
            </Modal>
        </div>
    )
}

export default App;