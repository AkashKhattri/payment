import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import chair from './Chair.jpg';
import gif from './giphy.webp';

function Product({ product }) {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: product.description,
                amount: {
                  currency_code: 'USD',
                  value: product.price
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaidFor(true);
          console.log(order);
        },
        onError: err => {
          setError(err);
          console.error(err);
        }
      })
      .render(paypalRef.current);
  }, [product.description, product.price]);

  if (paidFor) {
    return (
      <div>
        <h1>Congrats, you just bought {product.name}!</h1>
        <img src={gif} alt={product.description} />
      </div>
    );
  }

  return (
    <div>
      {error && <div>Uh oh, an error occurred! {error.message}</div>}
      <h1>
        {product.description} for ${product.price}
      </h1>
      <img src={product.image} alt={product.description} width='200' />
      <div ref={paypalRef} />
    </div>
  );
}

function App() {
  const product = {
    price: 777.77,
    name: 'comfy chair',
    description: 'fancy chair, like new',
    image: chair
  };
  return (
    <div className='App'>
      <Product product={product} />
    </div>
  );
}

export default App;
