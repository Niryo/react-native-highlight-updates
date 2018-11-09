import React from 'react';
import ReactNative from 'react-native';
const OriginalView = ReactNative.View;
const OriginalImage = ReactNative.Image;
const OriginalTouchableOpacity = ReactNative.TouchableOpacity;


function getMockContainer(OriginalComponent) {
  return class extends React.Component {
    static displayName = 'View';
    render() {
      return <OriginalComponent {...this.props}><HighlightComponent />{this.props.children}</OriginalComponent>;
    }
  };
}

class ViewMock extends React.Component {
  static displayName = 'View';
  render() {
    return <OriginalView {...this.props}><HighlightComponent />{this.props.children}</OriginalView>;
  }
}

class ImageMock extends React.Component {
  static displayName = 'View';
  render() {
    return <OriginalView style={{position: 'relative'}}><OriginalImage {...this.props} /><HighlightComponent /></OriginalView>;
  }
}

Object.defineProperty(ReactNative, 'View', {
  value: getMockContainer(OriginalView)
});
Object.defineProperty(ReactNative, 'TouchableOpacity', {
  value: getMockContainer(OriginalTouchableOpacity)
});
// Object.defineProperty(ReactNative, 'Image', {
//   value: ImageMock
// });



class HighlightComponent extends React.Component {
  constructor(props) {
    super(props);
    this.renderCount = 0;
    this.flag = true;
    this.clearTimeout;
  }

  getColor() {
    if (this.renderCount === 0) {
      return 'transparent';
    } else if (this.renderCount === 1) {
      return '#0eed4d'; //green
    } else if (this.renderCount === 2) {
      return '#faff00';//yellow
    } else if (this.renderCount === 3) {
      return '#ffb600';//orange
    } else {
      return '#ff3f00'; //red
    }
  }

  componentWillUnmount(){
    clearTimeout(this.clearTimeout);
  }

  render() {
    clearTimeout(this.clearTimeout);
    this.clearTimeout = setTimeout(() => {
      if (this.renderCount > 0) {
        this.renderCount = 0;
        this.flag = false;
        this.setState({}, () => {
          this.flag = true;
        });
      }
    }, 500);
    if (this.flag) {
      this.renderCount++;
    }
    const colorLayerStyle = {borderWidth: 3, borderColor: this.getColor(), position: 'absolute', top: 0, bottom: 0, left: 0, right: 0};
    return <OriginalView style={colorLayerStyle} pointerEvents="box-none" />;
  }
}