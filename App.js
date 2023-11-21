import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const imagePickerStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (imagePickerStatus.status !== "granted") {
        alert("Se requieren permisos para acceder a la biblioteca de medios.");
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef?.takePictureAsync();
      setCapturedPhoto(photo);
      setShowCamera(false);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setCapturedPhoto(selectedImage);
      }
    }
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => {
              setCameraRef(ref);
            }}
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.buttonText}>Capturar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {capturedPhoto ? (
            <Image source={{ uri: capturedPhoto.uri }} style={styles.capturedImage} />
          ) : (
            <Text style={styles.noImageText}>No se ha capturado ninguna imagen</Text>
          )}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setShowCamera(!showCamera)}>
          <Text style={styles.buttonText}>{showCamera ? "Cerrar cámara" : "Abrir cámara"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>Seleccionar desde galería</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "70%",
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  capturedImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  noImageText: {
    fontSize: 18,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
