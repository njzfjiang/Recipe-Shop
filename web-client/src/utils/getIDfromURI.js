export const getIDfromURI = (uri) => {
    return uri.substring(uri.indexOf("_")+1)
  };