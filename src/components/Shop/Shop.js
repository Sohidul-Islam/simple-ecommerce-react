import React, { useEffect, useState } from 'react';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import "./Shop.css";
import { addToDb, deleteShoppingCart, getItemFromLocalDb, getItemFromLocalDbByID } from '../../utilities/fakedb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const handleAddtoCart = (product) => {
        // console.log(product);
        let newProduct = []
        // if (getItemFromLocalDbByID(product.id)) {
        //     console.log("ho paisi");
        //     product.quantity += 1;
        // } else {
        //     console.log("nare painai");
        //     product.quantity = 1;
        //     newProduct = [...cart, product];
        // }
        const exists = cart.find(pd => pd.id === product.id);
        if (exists) {
            const rest = cart.filter(pd => pd.id !== product.id);
            exists.quantity += 1;
            newProduct = [...rest, exists];
        }
        else {
            product.quantity = 1;
            newProduct = [...cart, product];
        }

        console.log("New cart; ", newProduct);
        setCart(newProduct);
        addToDb(product.id)

    }

    useEffect(() => {
        // console.log("useEffect 1 ");
        fetch("./products.json")
            .then(res => res.json())
            .then(data => {
                setProducts(data)
                setSearchData(data)
                // console.log("Product Recieved");

            })

        // console.log(products);
    }, []);

    useEffect(() => {
        // console.log("useEffect 2 ");
        const newCart = [];
        if (products.length) {
            const addedProducts = getItemFromLocalDb();
            // console.log(addedProducts);
            for (const id in addedProducts) {
                const quantity = addedProducts[id];
                const savedProduct = products.find(product => product.id === id);

                savedProduct.quantity = quantity;
                console.log("Saved product quantity: ", quantity);
                newCart.push(savedProduct);

                // console.log("Quantity: ", quantity);
                // console.log("saved product: ", savedProduct);

            }

            console.log("New cart: ", newCart);
            setCart(newCart);
        }

    }, [products])


    const handleSearchBar = (e) => {
        const searchText = e.target.value;
        // console.log(searchText);
        const searchedProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
        setSearchData(searchedProducts)
        // console.log(searchedProducts.length);
    }
    return (
        <div>
            <div className="search-container">
                <input onChange={handleSearchBar} className="searchbar" type="text" placeholder="Search here" />
                <span style={{ color: "white", marginLeft: "16px" }}><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>{cart.reduce((previous, current) => previous + current.quantity, 0)}</span>
            </div>
            <div className="shop-container">
                <div className="product-container">
                    <h2>Products: {searchData.map((product, key) => <Product handleAddtoCart={handleAddtoCart} key={product.id} product={product}></Product>)}</h2>
                </div>
                <div className="cart-container">
                    <Cart cart={cart}>
                        <Link to="/order-review">
                            <button className="btn-regular">Review Your Order</button>
                        </Link>
                    </Cart>
                </div>
            </div>
        </div>

    );
};

export default Shop;