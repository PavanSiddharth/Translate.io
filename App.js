import React, { Component } from 'react';
import {StyleSheet,View,Text,TextInput,StatusBar,TouchableOpacity,Animated} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

class App extends Component
{
  constructor(props) {
    super(props);
    this.state = {
        german: [],
        english:"",
        loadapp:false,//used for conditional rendering
        startValue:new Animated.Value(0.5)//starting opacity value for the main page
    };
  }

  componentDidMount(){
    this.timeoutHandle = setTimeout(()=>{

      this.setState({loadapp:true})//To load the main page after 2 seconds. A simple loading screen is displayed for the first 2 seconds

      Animated.timing(this.state.startValue, {  //FadeIn animation for the main page
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    }, 2000);
  }

  componentWillUnmount(){
      clearTimeout(this.timeoutHandle); 
  }


//This function makes the api call for translation
  translate(){
    fetch("https://translation.googleapis.com/language/translate/v2?key=AIzaSyCvfXHDEUTzb9wwtgHWiWpcrTpl6ewtsvA&target=de&source=en&format=text&q="+this.state.english)
            .then(response => response.json())
            .then((responseJson) => {
                const translated_text = responseJson.data.translations[0].translatedText
                this.setState({
                    german: translated_text
                })
            })
            .catch(error => console.log(error))
  }

  render()
  {
    //loadScreen is a simple loading screen component with a font awesome icon(language icon)
    const loadscreen = 

      <View style={{backgroundColor:"#4885ed", justifyContent:"center", alignItems:"center", flex:1}}>
        <StatusBar backgroundColor="#4885ed"  />
        <FontAwesomeIcon icon={ faLanguage } color="white" size={100}/>
      </View>;

    //mainpage is the component with the translation functionality
    const mainpage =

    <Animated.View style={[styles.container, {opacity: this.state.startValue}]}>{/*FadeIn animation*/}

      <StatusBar backgroundColor="#4885ed"  />{/*To make the status bar in the mobile the same colour as our app's primary colour*/}

      <View style={styles.top}>{/*Title card with the app name and icon is displayed for 1/4 th of the screen*/}
        <Text style={{color:"white", fontSize: 25}}>TRANSLATE.IO</Text>
        <FontAwesomeIcon icon={ faLanguage } color="white" size={50}/>
      </View> 

      <View style={styles.bottom}>{/*View component with input field, submit button and the translated text is displayed for the remaining 3/4 th of the screen*/}
        <TextInput 
          style={styles.input}
          placeholder="Enter English Text"
          onChangeText={(text)=> this.setState({english:text})}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.translate()}>
          <Text style={{padding:10, color:"white", fontSize: 17.5}}>TRANSLATE</Text>
        </TouchableOpacity>     
        <Text style={{marginTop:20 ,fontSize: 35}}>{this.state.german}</Text>
      </View>

    </Animated.View>

    return(
      //Conditional rendering : loadscreen is displayed for 2 seconds and then mainpage is loaded
      this.state.loadapp ? mainpage : loadscreen
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 0.3,
    backgroundColor: "#4885ed",
    justifyContent:"center",
    alignItems:"center"
  },
  bottom: {
    flex: 0.7,
    backgroundColor: "white",
    justifyContent:"center",
    alignItems:"center"
  },
  button:{
    backgroundColor:"#4885ed",
    borderRadius:25,
    height:50,
    width:150,
    alignItems:"center",
    justifyContent:"center"
  },
  input: {
    height: 120, 
    width:400,
    fontSize:25, 
    borderColor:"#4885ed", 
    borderWidth: 2, 
    borderRadius:20, 
    marginBottom: 25
  }
});

export default App;
