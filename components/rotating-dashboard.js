import { Component, Children, cloneElement } from 'react'

export default class RotatingDashboard extends Component {
  static defaultProps = {
    interval: 5 // Rotating interval in seconds
  }

  state = {
    visibleDashboard: 0,
    transitionIn: false,
    transitionOut: false
  }

  componentDidMount () {
    this.rotateDashboards()
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  rotateDashboards () {
    if (this.props.children.length > 1) {
      this.setState({
        transitionOut: true,
        transitionIn: false
      })
      let transitionDuration = 500
      let newDashboardIndex = (this.state.visibleDashboard + 1) % this.props.children.length
      setTimeout(() => this.setState({
        visibleDashboard: newDashboardIndex,
        transitionIn: true,
        transitionOut: false
      }), transitionDuration)

      this.timeout = setTimeout(() => this.rotateDashboards(), this.props.interval * 1000)
    } else {
      this.setState({
        transitionOut: false,
        transitionIn: true
      })
    }
  }

  render () {
    const childrenWithProps = Children.map(this.props.children, child => {
      if (this.state.transitionOut) {
        return cloneElement(child, {animation: 'flipOut'})
      } else if (this.state.transitionIn) {
        return cloneElement(child, {animation: 'flipIn'})
      } else {
        return child
      }
    })
    return (
      childrenWithProps[this.state.visibleDashboard]
    )
  }
}
