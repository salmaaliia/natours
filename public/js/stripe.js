import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51SD1oQF1DoNyRJDYouTiud0MRbdWaQyfZeLseWrE3ZIxhkJqWIUZqW8ufzHMkZp0whkPWTsh1L31JV3MYayIGDYv00pPG5oz0p',
    );

    // 1) Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });
    // console.log(session);

    // 2) create checkout form + change creidit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
