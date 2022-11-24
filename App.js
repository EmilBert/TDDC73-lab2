import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, ImageBackground, Image, Pressable} from 'react-native';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

let years = [];
for(let i= 0; i < 13; i++) {
  let year = [2020 + i];
  years.push({label: year.toString(), value: year});
}

const months = [
  {label: "January", value: 1},
  {label: "Febuary", value: 2},
  {label: "March", value: 3},
  {label: "April", value: 4},
  {label: "January", value: 5},
  {label: "Febuary", value: 6},
  {label: "March", value: 7},
  {label: "April", value: 8},
  {label: "January", value: 9},
  {label: "Febuary", value: 10},
  {label: "March",    value: 11},
  {label: "April",    value: 12}
];

const CardNumber = (props) => {
  const cardNumber = props.value;
  let emptyCard = "#### #### #### ####";
  
  const formatCardNumber = (number) => {
  let toShow = cardNumber;
    
    if(cardNumber.length > 5) {
      toShow = toShow.slice(5, cardNumber.length -5);
    }
    
    toShow = toShow + emptyCard.slice(toShow.length);
    return toShow;
  }
  
  return(
    <Text style ={styles.cardNumber}>{formatCardNumber(cardNumber)}</Text>
  );
}

const Picker = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(props.items);
  
  return (
    <DropDownPicker 
      placeholder={props.placeholder}
      containerStyle = {styles.dropdown}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      style={{height: 50}}
  />
  )
}

const TextInputField = (props) => {
  return(
    <>
      <Text style={styles.inputTitle}>{props.title}</Text>
      <TextInput value={props.value} onChangeText = {props.onChangeText} style ={styles.inputFields}/>
    </>
  );
}

// Brand design
const Brand = (props) => {
  const brand = props.cardNumber;

  const getCardType = (number) => {
    number = number.toString();
    if(number != "") {
      let re = new RegExp("^4");
      if (number.match(re) != null) return <Image source = {require('./assets/visa.png')} style={styles.brand}></Image>;

      re = new RegExp("^(34|37)");
      if (number.match(re) != null) return <Image source = {require('./assets/amex.png')} style={styles.brand}></Image>;

      re = new RegExp("^5[1-5]");
      if (number.match(re) != null) return <Image source = {require('./assets/mastercard.png')} style={styles.brand}></Image>;

      re = new RegExp("^6011");
      if (number.match(re) != null) return <Image source = {require('./assets/discover.png')} style={styles.brand}></Image>;
      
      re = new RegExp('^9792');
      if (number.match(re) != null) return <Image source = {require('./assets/troy.png')} style={styles.brand}></Image>;
    }
    return <Image source = {require('./assets/visa.png')} style={styles.brand}></Image>; // default type
  }
  return(    
    <>
      {getCardType(brand)}
    </>
  );
}

export default function App() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");

  const OnCardNumberChange = (text) => {
    if(text.length > 19) {
      // Remove the characters that exceed the limit
      text = text.substring(0, 19);
    }
    // Remove all spaces and letters from text
    text = text.replace(/[^0-9]/g, "");

    // Split text into chunks of 4 characters
    let chunks = [];

    for(let i = 0; i < text.length; i+= 4) {
      chunks.push(text.substring(i, i + 4));
    }
  
    // Join the chunks with a space
    if(chunks != null && chunks.length > 1) {
      let formattedText = chunks.join(" ");
      setCardNumber(formattedText);
    }else{
      setCardNumber(text);
    }
  }

  
  return (
    
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.card}>
          <ImageBackground style ={styles.card} borderRadius = {10}  source = {require('./assets/background.jpeg')}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Image source = {require('./assets/chip.png')} style={styles.chip}></Image>
                {/* This SOURCE should update to display the correct card type depending on card number */}
                <View style={{width:60, height:40}}>
                  <Brand cardNumber = {cardNumber}/>
                </View>
              </View>
              <View style = {styles.cardNumberContainer}>
                <CardNumber value={cardNumber}/>
              </View>
              <View style={styles.row}>
                <View>
                  <Text style = {styles.cardTitles}>Card Holder</Text>
                  <Text style = {styles.cardSubNumbers}>XX XXX</Text>
                </View>
                <View>
                  <Text style = {styles.cardTitles}>Expires</Text>
                  <Text style = {styles.cardSubNumbers}>XX/XX</Text>
                </View>
              </View>
            </View>
          </ImageBackground> 
        </View>
        <StatusBar style="auto" />
        <TextInputField title="Card Number" value = {cardNumber} onChangeText = {cardNumber => OnCardNumberChange(cardNumber)}/>
        <TextInputField title="Card Holder" value = {cardName}   onChangeText = { cardName => setCardName(cardName)}/>
        <View style = {styles.row}>
          <View style={{width: "60%"}}>
            <Text style={styles.inputTitle}>Expiration Date</Text>
            <View style = {styles.row}>
              <Picker items={months} placeholder="Month"/> 
              <Picker items={years}  placeholder="Year"/>
            </View>
          </View>
          <View style={{width: "35%"}}>
            <TextInputField title="CVV"/>
          </View>
        </View>
        <Pressable style={styles.button}>
          <Text style={{width: "100%", textAlign:"center", padding:15, color:"white"}}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    width:"95%",
    borderRadius:10,
    padding:20,
    backgroundColor: '#DADADA',
    alignItems: 'center',
    paddingTop:100,
  },
  row: {
    width:"100%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  column: {
    width:"100%",
    height:"100%",
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding:20,
  },
  dropdown: {
    width: "48%",
  },
  inputFields: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "black",
    width: '100%',
    backgroundColor: 'white',
    padding:15
  },
  inputTitle:{
    width: '100%',
    textAlign:'start',
  },
  button: {
    marginTop:10,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#0055D4",
  },
  card: {
    position:"absolute",
    top: -65,
    marginBottom:20,
    width: "100%",
    height:200,
  },
  chip: {
    width: 50,
    aspectRatio:101/82,
    resizeMode: 'contained',
  },
  brand: {
    flex: 1,
    height:null,
    width: null,
    right: 0, 
    resizeMode: 'contain',
  },
  cardNumberContainer: {
    alignItems: "start",
  },
  cardNumber: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 24,
  },
  cardTitles: {
    color: "white",
  },
  cardSubNumbers: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  }
});
