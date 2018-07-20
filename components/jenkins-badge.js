const JenkinsBadge = ({status, size = 'small'}) => {
  let height = '30'
  switch (size) {
    case 'small':
      height = '25'
      break
    case 'medium':
      height = '100'
      break
    case 'big':
      height = '150'
      break
    default:
  }
  let image = ''
  switch (status) {
    case 'FAILURE':
    case 'red':
      image = '/static/angry.png'
      break
    case 'UNSTABLE':
      image = '/static/injured.png'
      break
    case 'SUCCESS':
    case 'blue':
      image = '/static/cool.png'
      break
    case 'ABORTED':
    case 'NOT_BUILT':
      image = '/static/sleep.png'
      break
    case 'IN_PROGRESS':
    case 'red_anime':
      image = '/static/thinking.png'
      break
    default:
  }
  return <img height={height} src={image} />
}

export default JenkinsBadge
