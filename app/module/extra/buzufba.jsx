import {ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, View} from "react-native";
import IconBack from "../../components/iconBack";
import IconUfba from "../../components/iconUfba";
import ByName from "../../components/byName";
import {theme} from "../../utils/theme";
import MapView, {Marker, Polyline} from "react-native-maps";
import {BACK_END} from "@env";
import React, {useEffect, useState} from "react";
import PointUFBA from "../../dto/Point";
import {BusUfba} from "../../dto/Bus";
import {Router} from "../../dto/Router";

const ws = new WebSocket(`ws://${BACK_END}/maps`)
ws.onerror = (e) => {
    console.log(e)
}
ws.onclose = () => {
    console.log('fechado')
}
ws.onopen = () => {
    console.log('entrou')
}
export default function Buzufba() {
    const [isPoint, setPoint] = useState([]);
    const [isBus, setBus] = useState([]);
    const [isCard, setCard] = useState(false)
    const [infos, setInfos] = useState(null)
    const [isRouter, setRouter] = useState([])
    const MarkePoints = ({userPosition}) => {

        return <Marker id={userPosition.id}
                       coordinate={{latitude: userPosition.locale.latitude, longitude: userPosition.locale.longitude}}
                       icon={require("../../../assets/onibus.png")}
                       tracksViewChanges={false} title={userPosition.name}
                       onPress={() => {
                           setRouter([])
                           setInfos({name: userPosition.name, id: userPosition.id})
                           setCard([true])
                       }}

        />
    }
    const CardPointToBus = () => {
        return (<View style={{
            zIndex: 5,
            position: "absolute",
            bottom: 0,
            height: "40%",
            width: "100%",
            backgroundColor: theme.primaryColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20
        }}>
            <Text style={{fontSize: 22, color: "white", padding: 12, marginLeft: 10}}>{infos.name}</Text>
            <View style={{backgroundColor: theme.secondColor, flex: 1, margin: 14, marginTop: 6, borderRadius: 8}}>
                {isBus.length > 0 ? <ListBus/> : <></>}
            </View>
        </View>)
    }
    useEffect(() => {
        isCard && ws.send(JSON.stringify(new BusUfba(infos?.name, infos?.id)))
    }, [isCard]);
    useEffect(() => {
        // isRouter && ws.send(JSON.stringify(new Router(infos?.id)))
        console.log(isRouter)
    }, [isRouter]);

    function ListBus() {
        return <FlatList data={isBus} renderItem={({item}) => {
            return <Pressable style={{margin:8,padding:8,backgroundColor:theme.primaryColor,borderRadius:6}} onPress={() => {
                ws.send(JSON.stringify(new Router(infos?.id)))
            }}><Text style={{color:"white"}}>{item.name}</Text></Pressable>
        }}/>
    }

    ws.onmessage = (ev) => {
        const value = JSON.parse(ev.data)
        switch (value.type) {
            case 'POINT': {
                setPoint(value.data)
                return
            }
            case 'BUS': {
                setBus(value.data)
                return;
            }
            case 'ROUTER': {
                setRouter(value.data)
                return
            }
        }


    }
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{
                position: "absolute",
                zIndex: 5,
                width: "100%",
                height: "12%",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                paddingLeft: 25,
                paddingRight: 25,
                paddingBottom: 0,
            }}>
                <View style={{
                    backgroundColor: theme.secondColor,
                    borderRadius: 30,
                    elevation: 6,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: 6,
                    paddingRight: 2,
                }}
                >
                    <IconBack color={theme.primaryColor}/>
                </View>
                <View style={{padding: 2, elevation: 6, backgroundColor: theme.secondColor, borderRadius: 30}}>
                    <IconUfba sizeU={48} sizeFBA={24} color={theme.primaryColor}/>
                </View>
            </View>

            <MapView style={{flex: 1, zIndex: 0, position: "relative"}}
                     followsUserLocation={false}
                     showsUserLocation={false}
                     renderToHardwareTextureAndroid={true}
                     showsMyLocationButton={false}
                     showsIndoors={false}
                     showsTraffic={false}
                     showsPointsOfInterest={false}
                     showsBuildings={false}
                     showsScale={false}
                     showsCompass={false}
                     showsIndoorLevelPicker={false}
                     cacheEnabled={false}
                     maxZoomLevel={17}
                     minZoomLevel={15}
                     region={{
                         latitude: -13.0024, //TODO valores para teste
                         longitude: -38.5089, //TODO valores para teste
                         latitudeDelta: 2,
                         longitudeDelta: 1
                     }}
                     onRegionChangeComplete={region => {
                         const data = JSON.stringify(new PointUFBA(region.latitude, region.longitude, "X1"))
                         ws.send(data)


                     }}
            >
                {isPoint.map(point => {
                    return <MarkePoints key={point.id} userPosition={point}/>
                })}
                {isRouter &&
                    <Polyline strokeWidth={6} strokeColor={theme.primaryColor} coordinates={isRouter.map(router => {
                        return {longitude: router.longitude, latitude: router.latitude}
                    })}/>}

            </MapView>
            {isCard ? <CardPointToBus/> : <></>}
            <ByName name={"VitaminaB3"} color={theme.primaryColor}/>
        </SafeAreaView>
    )
}
