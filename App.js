import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, ImageBackground, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFonts } from 'expo-font';

// We create the list of years to choose from
let years = [];
for (let i = 0; i < 13; i++) {
  let year = [2020 + i];
  years.push({ label: year.toString(), value: year });
}

// We create the list of months to choose from
const months = [
  { label: "January", value: 1 },
  { label: "Febuary", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 }
];

// Generic input field
// OnFocus: Update selected state
const TextInputField = (props) => {
  return (
    <>
      <Text style={styles.inputTitle}>{props.title}</Text>
      <TextInput value={props.value} onChangeText={props.onChangeText} onFocus={props.selected} style={styles.inputFields} maxLength={props.length} />
    </>
  );
}

// Generic drop down picker. 
const Picker = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(props.items);

  props.setThis(value);

  // Update selected state when user opens the drop down
  useEffect(() => {
    props.selected(false);
  }, [open]);

  return (
    <DropDownPicker
      placeholder={props.placeholder}
      containerStyle={styles.dropdown}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      style={{ height: 50 }}
    />
  )
}

// Display the expiration date on the card
const ExpirationDate = (props) => {
  return (
    <Text style={styles.cardSubNumbers}>{props.month}/{props.year}</Text>
  );
}

// Brand design
const Brand = (props) => {
  const brand = props.cardNumber;

  // Return correct image depending on card type, default is Visa
  const getCardType = (number) => {
    number = number.toString();
    if (number != "") {
      let re = new RegExp("^4");
      if (number.match(re) != null) return <Image source={require('./assets/visa.png')} style={props.style}></Image>;

      re = new RegExp("^(34|37)");
      if (number.match(re) != null) return <Image source={require('./assets/amex.png')} style={props.style}></Image>;

      re = new RegExp("^5[1-5]");
      if (number.match(re) != null) return <Image source={require('./assets/mastercard.png')} style={props.style}></Image>;

      re = new RegExp("^6011");
      if (number.match(re) != null) return <Image source={require('./assets/discover.png')} style={props.style}></Image>;

      re = new RegExp('^9792');
      if (number.match(re) != null) return <Image source={require('./assets/troy.png')} style={props.style}></Image>;
    }
    return <Image source={require('./assets/visa.png')} style={props.style}></Image>; // default type
  }
  return (
    <>
      {getCardType(brand)}
    </>
  );
}

const CardNumber = (props) => {
  const cardNumber = props.value;
  let emptyCard = "#### #### #### ####";
  let fillStars = "**** **** ";

  // Format card number to be displayed
  const formatCardNumber = () => {
    let toShow = cardNumber;

    // Always show the first 4 digits + a space
    toShow = toShow.substring(0, 5);

    // The ones in the middle are replaced with stars
    toShow = toShow + fillStars.substring(0, cardNumber.length - 5);

    // Also show the last 4 digits
    if (cardNumber.length > 15) toShow = toShow + cardNumber.substring(15, 20);

    // All unfilled slots are replaced with #
    toShow = toShow + emptyCard.slice(toShow.length);

    return toShow;
  }

  return (
    <Text style={styles.cardNumber}>{formatCardNumber()}</Text>
  );
}

const Card = (props) => {
  return (
    <View style={styles.cardContainer}>
      {/* If backside is true, initiate rotation transform */}
      <ImageBackground style={!props.backside ? styles.card : { ...styles.card, transform: "rotateY(180deg)" }} imageStyle={{ borderRadius: 10 }} source={require('./assets/background.jpeg')}>
        {/* Card front side */}
        <View style={{ ...styles.column, ...styles.cardFront }}>
          <View style={styles.row}>
            <Image source={require('./assets/chip.png')} style={styles.chip}></Image>
            {/* This SOURCE should update to display the correct card type depending on card number */}
            <View style={{ width: 60, height: 40 }}>
              <Brand cardNumber={props.cardNumber} style={styles.brand} />
            </View>
          </View>
          <View style={styles.cardNumberContainer}>
            <CardNumber value={props.cardNumber} />
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.cardTitles}>Card Holder</Text>
              <Text style={styles.cardSubNumbers}>{props.cardName.length > 0 ? props.cardName : "FULL NAME"}</Text>
            </View>
            <View>
              <Text style={styles.cardTitles}>Expires</Text>
              <Text style={styles.cardSubNumbers}>{props.month}/{props.year}</Text>
            </View>
          </View>
        </View>

        {/* Card back side */}
        <View style={{ flex: 1, alignItems: 'center', ...styles.cardBack }} >
          <View style={styles.blackBar} />
          <Text style={{ width: "95%", textAlign: "end", color: "white", fontWeight: 'bold' }}>CVV </Text>
          <View style={styles.whiteBar}>
            {/* Convert CVV number to stars on the card view */}
            <Text style={{ width: "100%", textAlign: "end", position: "absolute" }}>{"****".toString().substring(0, props.cvv.length)} </Text>
          </View>
          <View style={{ width: 60, height: 40, flex: 1, justifyContent: 'flex-end' }}>
            <Brand cardNumber={props.cardNumber} style={styles.brandBackside} />
          </View>
        </View >

      </ImageBackground>
    </View >
  );
}

export default function App() {
  const [loaded] = useFonts({
    "UbuntuMono-Regular": require("./assets/fonts/UbuntuMono-Regular.ttf"),
  });

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [month, setMonth] = useState("XX");
  const [year, setYear] = useState("XX");
  const [backside, setBackside] = useState(false);
  const [cvv, setCvv] = useState("");

  // Format value to have only spaces and digits
  const OnCardNumberChange = (text) => {
    if (text.length > 19) {
      // Remove the characters that exceed the limit
      text = text.substring(0, 19);
    }
    // Remove all spaces and letters from text
    text = text.replace(/[^0-9]/g, "");

    // Split text into chunks of 4 characters
    let chunks = [];

    for (let i = 0; i < text.length; i += 4) {
      chunks.push(text.substring(i, i + 4));
    }

    // Join the chunks with a space
    if (chunks != null && chunks.length > 1) {
      let formattedText = chunks.join(" ");
      setCardNumber(formattedText);
    } else {
      setCardNumber(text);
    }
  }

  const OnCardNameChange = (text) => {
    text = text.replace(/[^a-zA-Z ]/g, "");
    setCardName(text);
  }

  // Format value to have only digits and a maximum of 4 characters
  const OnCVVChange = (text) => {
    text = text.replace(/[^0-9]/g, "");
    text = text.substring(0, 4);
    setCvv(text);
  }

  // Set value to the last 2 digits
  const OnExpMonthChange = (expMonth) => {
    if (expMonth != null) {
      if (expMonth.toString().length < 2) {
        setMonth("0" + expMonth);
      } else {
        setMonth(expMonth);
      }
    }
  }

  const OnExpYearChange = (expYear) => {
    if (expYear != null) {
      setYear(expYear.toString().substring(2, 4));
    }
  }

  const SelectedCVV = (selected) => {
    setBackside(selected);
  }

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Card cardNumber={cardNumber} month={month} year={year} cvv={cvv} cardName={cardName} backside={backside} />
        <StatusBar style="auto" />
        <TextInputField title="Card Number" value={cardNumber} selected={() => SelectedCVV(false)} onChangeText={cardNumber => OnCardNumberChange(cardNumber)} />
        <TextInputField title="Card Holder" value={cardName} selected={() => SelectedCVV(false)} length={15} onChangeText={cardName => OnCardNameChange(cardName)} />
        <View style={styles.row}>
          <View style={{ width: "60%" }}>
            <Text style={styles.inputTitle}>Expiration Date</Text>
            <View style={styles.row}>
              <Picker items={months} setThis={OnExpMonthChange} selected={() => SelectedCVV(false)} placeholder="Month" />
              <Picker items={years} setThis={OnExpYearChange} selected={() => SelectedCVV(false)} placeholder="Year" />
            </View>
          </View>
          <View style={{ width: "35%" }}>
            <TextInputField title="CVV" value={cvv} onChangeText={cvv => OnCVVChange(cvv)} selected={() => SelectedCVV(true)} />
          </View>
        </View>
        <Pressable style={styles.button}>
          <Text style={{ width: "100%", textAlign: "center", padding: 15, color: "white" }}>Submit</Text>
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
    width: "95%",
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#DADADA',
    alignItems: 'center',
    paddingTop: 100,
    maxWidth: 400,

    shadowColor: "#000000",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.21,
    shadowRadius: 8.19,
    elevation: 11,
  },
  row: {
    width: "100%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  column: {
    width: "100%",
    height: "100%",
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  dropdown: {
    width: "48%",
  },
  inputFields: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white',
    padding: 15
  },
  inputTitle: {
    marginTop: 10,
    width: '100%',
    textAlign: 'start',
  },
  button: {
    marginTop: 10,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#0055D4",
    zIndex: -1,
    shadowColor: "#0055D4",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.21,
    shadowRadius: 8.19,
    elevation: 11,
  },
  cardContainer: {
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
    position: 'absolute',
    top: -110,
    //overflow: 'hidden',
    backgroundColor: "transparent",
    perspective: 1000,
    width: "92%",
  },
  card: {
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.21,
    shadowRadius: 8.19,
    elevation: 11,
    height: 200,
    transition: "transform 0.8s",
    transformStyle: "preserve-3d",
  },
  cardFront: {
    borderRadius: 10,
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    borderRadius: 10,
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
  },
  chip: {
    width: 50,
    aspectRatio: 101 / 82,
    resizeMode: 'contain',
  },
  brand: {
    flex: 1,
    height: null,
    width: null,
    right: 0,
    resizeMode: 'contain',
  },
  brandBackside: {
    flex: 1,
    height: null,
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
    fontFamily: 'UbuntuMono-Regular',
  },
  cardTitles: {
    color: "white",
  },
  cardSubNumbers: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: 'UbuntuMono-Regular',
  },
  blackBar: {
    marginTop: 25,
    width: "100%",
    height: 50,
    opacity: 0.75,
    backgroundColor: "black",
  },
  whiteBar: {
    width: "95%",
    height: 38,
    backgroundColor: "white",
    borderRadius: 5,
  },

});
