export const paymentApi = async (token) => {
    const url = `http://localhost:5000/stripepayment-20e0d/us-central1/completePayment`;
    const uri = `https://us-central1-stripepayment-20e0d.cloudfunctions.net/completePayment`;
    return await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 10,
            currency: "inr",
            token: token.id
        }),
    });
}