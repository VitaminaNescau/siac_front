import {SafeAreaView, View, Text, FlatList, Pressable} from "react-native";
import {global, theme} from "../../utils/theme";
import {StatusBar} from "expo-status-bar";
import IconBack from "../../components/iconBack";
import React from "react";
import {Image} from "expo-image";
import {Food} from "../../utils/teste";
import ByName from "../../components/byName";

export default function Menu() {
    const FoodUNI = ({food}) => {
        return  <>
        <Text>{food.type}</Text>
        <View
            style={{
                height: "auto",
                justifyContent: "center",
                alignItems: "left",
                margin: 8,
                padding: 12,
                backgroundColor: theme.secondColor,
                elevation: 6
            }}>

            <Text>{food.name}</Text>
            {food.alert && <Text>{food.alert}</Text>}
        </View></>
    }
    return <SafeAreaView style={global.body}>

        <View style={global.bigBody}>
            <View style={{position: "absolute", width: 30, height: 30, top: "3%", zIndex: 5, left: "10%"}}>
                <IconBack color={theme.primaryColor}/>
            </View>

            <View style={global.infoView}>
                <Text style={{
                    fontSize: 36,
                    fontWeight: "700",
                    width: "100%",
                    textAlign: "right",
                    padding: 12
                }}> Restaurante Universitario</Text>

                <View style={{flex: 1, flexDirection: "row"}}>
                    <Image style={{flex: .5}} contentFit="scale-down"
                           source={require("../../../assets/logo_custom_ufba.png")}/>
                    <FlatList style={{flex: 1, width: "50%",}} data={Food} renderItem={({item}) => {
                        return <FoodUNI food={item}/>
                    }}/>
                </View>
                <ByName name={"VitaminaNescau"} color={theme.primaryColor}/>
            </View>

        </View>
        <StatusBar backgroundColor={theme.primaryColor} style={"light"}/>

    </SafeAreaView>
}

