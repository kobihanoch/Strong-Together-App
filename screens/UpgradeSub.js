import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import * as IAP from "expo-in-app-purchases";

const PRODUCT_ID = "com.strongtogether.pro.monthly"; // must match App Store Connect

const UpgradeSub = () => {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let sub;
    (async () => {
      // Connect to the store
      const { responseCode } = await IAP.connectAsync();
      if (responseCode !== IAP.IAPResponseCode.OK) {
        Alert.alert("Store not available");
        return;
      }
      setReady(true);

      // Get products
      const { results } = await IAP.getProductsAsync([PRODUCT_ID]);
      setProducts(results || []);

      // Listen for purchases
      sub = IAP.setPurchaseListener(
        async ({ responseCode, results, errorCode }) => {
          if (responseCode === IAP.IAPResponseCode.OK && results?.length) {
            for (const p of results) {
              try {
                // p.acknowledgedAndroid is Android only; ignore on iOS
                // Send receipt to your server
                await fetch("https://your.api/api/subs/prosub", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer <token>",
                  },
                  body: JSON.stringify({
                    productId: PRODUCT_ID,
                    transactionReceipt: p.transactionReceipt, // base64
                  }),
                })
                  .then((r) => r.json())
                  .then((j) => {
                    if (!j.ok) throw new Error("Server verification failed");
                    Alert.alert("Pro is active", `Expires at: ${j.expiresAt}`);
                  });
              } catch (e) {
                Alert.alert("Verification error", String(e?.message || e));
              } finally {
                // Finish transaction so Apple can complete it
                await IAP.finishTransactionAsync(p, true);
              }
            }
          } else if (responseCode === IAP.IAPResponseCode.USER_CANCELED) {
            // user canceled
          } else if (errorCode) {
            Alert.alert("IAP error", String(errorCode));
          }
        }
      );
    })();

    return () => {
      sub?.remove();
      IAP.disconnectAsync();
    };
  }, []);

  const buy = async () => {
    if (!ready) return;
    await IAP.purchaseItemAsync(PRODUCT_ID);
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>asdasd</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default UpgradeSub;
