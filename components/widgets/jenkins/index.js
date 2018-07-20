import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Table, { Td } from '../../table'
import LoadingIndicator from '../../loading-indicator'
import JenkinsBadge from '../../jenkins-badge'
import { basicAuthHeader } from '../../../lib/auth'

const schema = yup.object().shape({
  // url: yup.string().url().required(),
  jobs: yup.array(yup.object({
    label: yup.string().required(),
    path: yup.string().required()
  })).required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string()
})

export default class Jenkins extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Jenkins'
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
    const {authKey, jobs, url} = this.props
    const opts = authKey ? {headers: basicAuthHeader(authKey)} : {}
    // opts.mode = 'no-cors'

    try {
      const builds = await Promise.all(
        jobs.map(async job => {
          const res = await fetch(`${url}/job/${job.path}/lastBuild/api/json`, opts)
          const json = await res.json()
          return {
            name: job.label,
            url: json.url,
            result: json.result === null ? 'IN_PROGRESS' : json.result,
            culprits: json.culprits
          }
        })
      )

      this.setState({error: false, loading: false, builds})
    } catch (error) {
      console.error(error)
      this.setState({error: true, loading: false})
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const {loading, error, builds} = this.state
    const {title} = this.props
    let annoying = false
    let rows = []
    builds && builds.map(build => {
      annoying = (annoying === false && build.result === 'FAILURE')
      rows.push((
        <tr key={`jenkins-${build.name}`}>
          {/* <Th>{build.name}</Th> */}
          <Td>
            <a href={build.url} title={build.result}>
              {

                build.result
                  ? <JenkinsBadge status={build.result} size='big' />
                  : <LoadingIndicator size='medium' />
              }
            </a>
          </Td>
        </tr>)
      )
      // if (build.result === 'FAILURE') {
      //   rows.push((<tr>
      //     <Th>Culprit</Th>
      //     <Td>{build.culprits[0].fullName}</Td>
      //   </tr>))
      // }
    })

    return (
      <Widget title={title} error={error} loading={loading} annoying={annoying} >
        <Table>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </Widget>
    )
  }
}
