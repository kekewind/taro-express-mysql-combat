// import { PureComponent } from "react";

const withShare = (opts) => {
  return (WrapperComponent) => {
    class WithShare extends WrapperComponent {
      onShareAppMessage() {
        return {
          ...opts,
          path: `/${this.props.tid}`,
        }
      }
    }

    return WithShare
  }
}

export default withShare