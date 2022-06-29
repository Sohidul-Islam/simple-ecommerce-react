import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import UseCart from '../../Hooks/UseCart';
import UseProducts from '../../Hooks/UseProducts';
import { deleteShoppingCart, removeFromDb } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';

const OrderReview = () => {
    const [products, setProducts] = UseProducts([]);
    const [cart, setCart] = UseCart(products);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth()
    const removeHandler = (key) => {
        // console.log("Deleted key: ", key);
        const deleteCart = cart.filter(product => product.id !== key);
        // console.log("new cart: ", deleteCart);
        setCart(deleteCart);
        removeFromDb(key);
    }
    const purchase = () => {
        if (cart.length > 0) {
            if (user?.email) {
                deleteShoppingCart();
                const newCart = [];
                setCart(newCart);

            }
            const tmepLocation = location.pathname;
            console.log("state from tmepLocation", tmepLocation);
            navigate("/placeorder", {
                state: { from: tmepLocation }
            })
        }


    }
    return (
        <div>
            <div className="shop-container">
                <div className="product-container">
                    {cart.length ? cart.map(product => <ReviewItem key={product.id} remove={removeHandler} product={product}></ReviewItem>) : <h2>Not Item Found</h2>}
                </div>
                <div className="cart-container">
                    <Cart cart={cart}>
                        <button onClick={purchase} className="btn-regular">Purchase</button>
                    </Cart>
                </div>
            </div>
        </div>
    );
};

export default OrderReview;