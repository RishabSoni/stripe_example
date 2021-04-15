import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button
} from 'react-native';
import { paymentApi } from './src/service';
import PaymentButton from './src/components/PaymentButton';
import stripe from 'tipsi-stripe';
stripe.setOptions({
  publishableKey: 'pk_test_51IfOzgSBb4zwnofZPfD3HuCwxthoZ0mUw1GveAdXjyPiXfm0yVc3r9bZEGUDNWtf8LOnbTJhuPwuWkiFG2NkUG3y00a7G3YoL5'
})



class App extends React.Component {
  state = {
    loading: false,
    token: null,
    success: null
  }

  handleCardPayPress =  async () => {
    try {
      this.setState({ loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm({
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Enappd Store',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: '',
            country: 'Estonia',
            postalCode: '31217',
            email: 'admin@enappd.com',
          },
        },
      })
      console.log(token, "<====token payment");

      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  doPayment = () => {
    
    let form = new FormData();
    form.append('amount', 1);
    form.append('currency', 'inr');
    form.append('token', this.state.token.id);
    console.log(form , 'hii called')
    // Use firebase serve for local testing if you don't have a paid firebase account
    fetch('http://192.168.0.101:5000/stripepayment-20e0d/us-central1/completePayment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: form
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          success: responseJson.status == 'succeeded' ? true : false,
        })
      }, (err) => {
        console.warn('error', err)
      })
      .catch((error) => {
        console.error(error);
      });
  }
 

  render() {
    const { loading, token, success, response } = this.state
   console.log(token, "<===tkn")
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: 'https://enappd.com/static/images/enappd-logo-blue.png' }}
        />
        <View style={styles.containerTitle}>
          <Text style={styles.title}>
            Stripe Payment in React Native
        </Text>
          <Text style={styles.subtitle}>
            by Enappd
        </Text>
        </View>
        <Text style={styles.header}>
          Card Form Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        <PaymentButton
          text="Enter you card and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
        />
        <View
          style={styles.token}
          >
          {token &&
            <>
              <Text style={styles.instruction}>
                Token: {token.id}
              </Text>
            <PaymentButton
                text="Make Payment"
                loading={loading}
                onPress={this.doPayment}
              />

            </>
          }
          {success &&
            <>
              <Text style={styles.instruction}>
                Status: {response.status}
              </Text>
              <Text style={styles.instruction}>
                ID: {response.id}
              </Text>
              <Text style={styles.instruction}>
                Amount: {response.amount}
              </Text>
            </>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  paymentMethod: {
    height: 20,
  },
})


export default App;
