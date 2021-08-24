import { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
// import URLSearchParams from "@ungap/url-search-params";
import { Block, View, WebView } from "@tarojs/components";

export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canUseWebView: Taro.canIUse("web-view"),
      url: "",
    };
  }
  componentDidMount() {
    let { url } = Object(getCurrentInstance().router.params.data)
    this.setState({
      url: url || ""
    })
  }
  render() {
    const { url, canUseWebView } = this.state;
    return canUseWebView ? (
      <Block>
        {url ? (
          <WebView src={url} onMessage={this.onWebMessage}></WebView>
        ) : (
          <View>url出错了～</View>
        )}
      </Block>
    ) : (
      <View>APP版本太低，无法跳转~</View>
    );
  }
}
