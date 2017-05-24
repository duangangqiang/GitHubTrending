export default class StringUtil {

  static trim( text ){
    if (typeof(text) === "string")  {
      return text.replace(/^\s*|\s*$/g, "");
    }
    else{
      return text;
    }
  }
}
