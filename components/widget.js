import styled, { keyframes } from 'styled-components'
import { size } from 'polished'
import LoadingIndicator from './loading-indicator'
import ErrorIcon from './error-icon'

const annoying = keyframes`
  from {
    background-color: red;
  }

  to {
    background-color: ${props => props.theme.palette.canvasColor};
  }
`

export function animate (anim) {
  if (anim) {
    return `
    animation: ${annoying} 0.5s linear infinite
  `
  }
}

const Container = styled.div`
  ${size('20em')}
  width: ${props => {
    if (props.size === 'small') {
      return '20em'
    } else if (props.size === 'medium') {
      return '30em'
    } else {
      return '40em'
    }
  }};
  overflow: hidden;
  align-items: center;
  background-color: ${props => props.theme.palette.canvasColor};
  border: 1px solid ${props => props.theme.palette.borderColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0.2em;
  padding: 0.3em;
  ${props => animate(props.annoying)}
`

const Title = styled.h1`
    text-align: center;
    margin: 0.3em;
`

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-direction: column;

`

export default ({children, error = false, loading = false, title = '', size = 'small', annoying = false}) => {
  let content

  if (loading) {
    content = <LoadingIndicator />
  } else if (error) {
    content = <ErrorIcon />
  } else {
    content = children
  }

  return (
    <Container size={size} annoying={annoying}>
      {title ? <Title>{title}</Title> : ''}
      <Content>{content}</Content>
    </Container>
  )
}
