import { Component } from 'react'
import Head from 'next/head'
import styled, { injectGlobal, ThemeProvider } from 'styled-components'
import { normalize } from 'polished'

injectGlobal`
  ${normalize()}

  html {
    font-family: 'Roboto', sans-serif;
  }
`

const Title = styled.div`
    width: 100%;
    display: flex;
    
    img {
      height:50px;
    }
`

const TitleHeader = styled.h1`
    padding:0;
    margin:10px;
    margin-right:165px;
    display:table-cell;
    vertical-align:middle;
    text-align: center;
    flex-grow: 1;
`

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`

const Container = styled.main`
  align-items: center;
  background-color: ${props => props.theme.palette.backgroundColor};
  color: ${props => props.theme.palette.textColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1em;
`

const Card = styled.div`
    margin: 0;
    display: block;
    transform: rotateY(90deg);
    transform-style: preserve-3d;
    backface-visibility: hidden;

    &.flipOut {
      transform: rotateY(270deg);
      transition: transform 500ms;

    }

    &.flipIn {
      transform: rotateY(360deg);
      transition: transform 500ms;
    }
`

export default class Dashboard extends Component {
  static defaultProps = {
    animation: '',
    title: ''
  }

  constructor (props) {
    super(props)
    this.state = {
      className: 'flipOut'
    }
    this.performAnimation(this.props.animation)
  }

  componentDidMount () {
    // this.timeout = setTimeout(() => this.flipIn(), 1)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps.animation)
    if (nextProps.animation !== this.props.animation) {
      this.performAnimation(nextProps.animation)
    }
  }

  performAnimation (animation) {
    if (animation && animation === 'flipIn') {
      this.timeout = setTimeout(() => this.flipIn(), 1)
    } else if (animation && animation === 'flipOut') {
      this.timeout = setTimeout(() => this.flipOut(), 1)
    }
  }

  flipIn () {
    this.setState({className: 'flipIn'})
  }

  flipOut () {
    this.setState({className: 'flipOut'})
  }

  getCardElement (child, index) {
    return <Card key={index} className={this.state.className}>{child}</Card>
  }

  render () {
    let cards = []
    if (this.props.children.length > 1) {
      this.props.children.map((c, index) => {
        cards.push(this.getCardElement(c, index))
      })
    } else {
      cards.push(this.getCardElement(this.props.children, 0))
    }

    return (
      <ThemeProvider theme={this.props.theme}>
        <Container>
          <Head>
            <link
              href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
              rel='stylesheet'
            />
          </Head>
          <Title>
            <img src={'/static/uob-logo.png'} />
            <TitleHeader>{this.props.title}</TitleHeader>
          </Title>
          <Content>
            {cards}
          </Content>
        </Container>
      </ThemeProvider>
    )
  }
}
