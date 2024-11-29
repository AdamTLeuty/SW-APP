import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  title: {
    fontSize: 25,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 44,
    gap: 23,
  },
  button: {
    borderRadius: 47,
    backgroundColor: "#4378ff",
    paddingHorizontal: 39,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 29,
  },
  retakeButton: {
    backgroundColor: "#F7F6F8",
  },
  preview: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
  },
});

export const homeStyles = StyleSheet.create({
  content_link: {
    width: "100%",
    minHeight: 200,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: "#0553",
    flexShrink: 1,
  },
  content_right: {
    flexGrow: 1,
    backgroundColor: "#4378ff",
    alignItems: "center",
    justifyContent: "center",
    gap: 19,
  },
  contentHeading: {
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center",
  },
  contentButton: {
    borderRadius: 64,
    backgroundColor: "#fff",
    paddingHorizontal: 19,
    paddingVertical: 10,
    marginHorizontal: 19,
  },
  contentButtonText: {
    fontSize: 14,
    lineHeight: 21,
  },

  containerHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
    textAlign: "center",
    marginBottom: 22,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  alignerChangeButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginVertical: 36.5,
    textAlign: "center",
  },
  alignerChangeText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 29,
  },
  progressHolder: {
    width: "100%",
  },
});

export const universalStyles = StyleSheet.create({
  content_link: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: "#0553",
  },
  content_right: {
    flexGrow: 1,
    backgroundColor: "#4378ff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  contentHeading: {
    fontSize: 26,
    lineHeight: 26,
    textAlign: "center",
    textOverflow: "",
  },
  contentButton: {
    borderRadius: 64,
    backgroundColor: "#fff",
    paddingHorizontal: 19,
    paddingVertical: 10,
    marginHorizontal: 19,
  },
  contentButtonText: {
    fontSize: 14,
    lineHeight: 21,
  },
  containerHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 30,
    paddingHorizontal: 44,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  scrollcontentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 26,
    lineHeight: 33,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
  },
  bottomMargin: {
    marginBottom: 23,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  alignerChangeButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    //marginVertical: 36.5,
    textAlign: "center",
  },
  alignerChangeText: {
    fontSize: 18,
    textAlign: "center",
    alignContent: "center",
    verticalAlign: "middle",
    lineHeight: 29,
    width: "100%",
  },
  progressHolder: {
    width: "100%",
  },

  button: {
    borderRadius: 47,
    backgroundColor: "#4378ff",
    paddingHorizontal: 39,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 29,
  },
  retakeButton: {
    backgroundColor: "#F7F6F8",
  },
  preview: {
    width: "100%",
    borderRadius: 10,
    flexGrow: 1,
  },
  input: {
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 43,
    fontSize: 16,
    verticalAlign: "bottom",
  },
});

export const progressStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  content: {},
});
