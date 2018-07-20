import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import yup from 'yup'
import Table, { Th, Td } from '../../table'
import LoadingIndicator from '../../loading-indicator'
import JenkinsBadge from '../../jenkins-badge'
import { basicAuthHeader } from '../../../lib/auth'

const maxRowNbr = 5

// const jenkinsBadgeColor = ({theme, status}) => {
//   switch (status) {
//     case 'red':
//       return theme.palette.errorColor
//     case 'blue':
//       return theme.palette.successColor
//     default:
//       return 'transparent'
//   }
// }
// const JenkinsBadge = styled(Badge)`
//   background-color: ${jenkinsBadgeColor};
// `

const schema = yup.object().shape({
  // url: yup.string().url().required(),
  job: yup.object({
    label: yup.string().required(),
    path: yup.string().required()
  }).required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string()
})

export default class JenkinsBranch extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Jenkins Branches'
  }

  state = {
    loading: true,
    error: false
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({error: true, loading: false})
      })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  async fetchInformation () {
    const colorToRemove = ['notbuilt', 'disabled', 'blue']
    const {authKey, job, url} = this.props
    const opts = authKey ? {headers: basicAuthHeader(authKey)} : {}
    try {
      const res = await fetch(`${url}/job/${job.path}/job/Branches/api/json`, opts)
      const json = await res.json()
      const jobs = json.jobs.filter(j => colorToRemove.indexOf(j.color) < 0 && j.name !== 'master')
      const builds = jobs.map(b => {
        b.name = decodeURIComponent(b.name)
        return b
      })
      this.setState({error: false, loading: false, builds})
    } catch (error) {
      this.setState({error: true, loading: false})
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const {loading, error, builds} = this.state
    const {title} = this.props

    const content = builds && builds.length !== 0 ? this.noGood() : this.allGood()

    return (
      <Widget title={title} error={error} loading={loading}>
        <Table>
          <tbody>
            {content}
          </tbody>
        </Table>
      </Widget>
    )
  }

  allGood () {
    return (
      <tr>
        {/*<Th>All Good</Th>*/}
        <Td>
          <JenkinsBadge status='blue' size='big' />
        </Td>
      </tr>
    )
  }

  noGood () {
    const nbrOfRows = this.getNbrOfRows()
    let rows = []
    for (let i = 0; i < nbrOfRows; i++) {
      rows.push(this.getRow(i))
    }
    return rows
  }

  getRow (rowNbr) {
    const {builds} = this.state
    const nbrOfRows = this.getNbrOfRows()
    if (rowNbr === (nbrOfRows - 1) && builds.length > nbrOfRows) {
      const notDisplayedBuildsNumber = builds.length - rowNbr + 1
      return (
        <tr key={`jenkins-branch-${this.props.job.label}`}>
          <Th>{notDisplayedBuildsNumber} more failing ...</Th>
          <Td><JenkinsBadge status='red' /></Td>
        </tr>
      )
    }
    return (
      <tr key={`jenkins-branch-${builds[rowNbr].name}`}>
        {this.nameCell(builds[rowNbr])}
        {this.statusCell(builds[rowNbr])}
      </tr>
    )
  }

  getNbrOfRows () {
    const {builds} = this.state
    return (builds.length >= maxRowNbr) ? maxRowNbr : builds.length
  }

  nameCell (element) {
    if (element === undefined) {
      return (<Th />)
    } else {
      return (<Th>{element.name}</Th>)
    }
  }

  statusCell (element) {
    if (element === undefined) {
      return (<Th />)
    } else {
      return (<Td>
        <a href={element.url} title={element.color}>
          {
            element.color
              ? <JenkinsBadge status={element.color} />
              : <LoadingIndicator size='small' />
          }
        </a>
      </Td>)
    }
  }
}
