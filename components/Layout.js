import { Dimensions, ScrollView, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const Layout = ({ children }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true} // מאפשר לראות את פס הגלילה
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f5f7",
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.08,
    paddingBottom: height * 1.2,
    height: height,
    fontFamily: "Inter_400Regular",
  },
});

export default Layout;
