/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourID) => {
  const stripe = Stripe(
    'pk_test_51HyZyvCTYBtBr8cNRSfaMD9yH1OVhLNUAAjUI8ZudmsxfYNXGeVxuvAWh2fK9gVerTfrO5w5mf4isGLSzc6yTb6g00On2Eg16C'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`
    );
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert(err);
  }
};
