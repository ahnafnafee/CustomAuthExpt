import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import * as AuthSession from "expo-auth-session";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "d8e31efe1c0f46fca50bffa2d9fbd9ce";

export default class App extends Component {
    state = {
        userInfo: null,
        didError: false,
    };

    handleSpotifyLogin = async () => {
        const prefix = Linking.createURL("/");
        const url = Linking.useURL;
        console.log(url);

        const redirectUrl = AuthSession.makeRedirectUri({});
        let results = await AuthSession.startAsync({
            authUrl: `https://www.playstation.com/en-in/sign-in-and-connect`,
        });
        if (results.type !== "success") {
            console.log(results.type);
            this.setState({ didError: true });
        } else {
            console.log(results);
            const userInfo = await axios.get(`https://api.spotify.com/v1/me`, {
                headers: {
                    Authorization: `Bearer ${results.params.access_token}`,
                },
            });
            this.setState({ userInfo: userInfo.data });
        }
    };

    displayError = () => {
        return (
            <View style={styles.userInfo}>
                <Text style={styles.errorText}>
                    There was an error, please try again.
                </Text>
            </View>
        );
    };

    displayResults = () => {
        {
            return this.state.userInfo ? (
                <View style={styles.userInfo}>
                    <Image
                        style={styles.profileImage}
                        source={{ uri: this.state.userInfo.images[0].url }}
                    />
                    <View>
                        <Text style={styles.userInfoText}>Username:</Text>
                        <Text style={styles.userInfoText}>
                            {this.state.userInfo.id}
                        </Text>
                        <Text style={styles.userInfoText}>Email:</Text>
                        <Text style={styles.userInfoText}>
                            {this.state.userInfo.email}
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={styles.userInfo}>
                    <Text style={styles.userInfoText}>
                        Login to Spotify to see user data.
                    </Text>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <FontAwesome name="spotify" color="#2FD566" size={128} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleSpotifyLogin}
                    disabled={this.state.userInfo ? true : false}
                >
                    <Text style={styles.buttonText}>Login with Spotify</Text>
                </TouchableOpacity>
                {this.state.didError
                    ? this.displayError()
                    : this.displayResults()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        backgroundColor: "#000",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    button: {
        backgroundColor: "#2FD566",
        padding: 20,
    },
    buttonText: {
        color: "#000",
        fontSize: 20,
    },
    userInfo: {
        height: 250,
        width: 200,
        alignItems: "center",
    },
    userInfoText: {
        color: "#fff",
        fontSize: 18,
    },
    errorText: {
        color: "#fff",
        fontSize: 18,
    },
    profileImage: {
        height: 64,
        width: 64,
        marginBottom: 32,
    },
});
