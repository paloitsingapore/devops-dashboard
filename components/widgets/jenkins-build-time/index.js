import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import yup from 'yup'
import Widget from '../../widget'
import { basicAuthHeader } from '../../../lib/auth'

const TimeItem = styled.div`
  font-size: 4em;
  text-align: center;
`

const schema = yup.object().shape({
  // url: yup.string().url().required(),
  jobs: yup.array(yup.object({
    path: yup.string().required()
  })).required(),
  interval: yup.number(),
  title: yup.string(),
  nbrOfBuilds: yup.number(),
  authKey: yup.string()
})

export default class Jenkins extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Jenkins',
    nbrOfBuilds: 10
  }

  state = {
    averagebuildTime: 0,
    loading: true,
    error: false
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({ error: true, loading: false })
      })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  async fetchInformation () {
    const { authKey, jobs, url, nbrOfBuilds } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}
    // opts.mode = 'no-cors'

    try {
      const averagebuildTime = await Promise.all(
        jobs.map(async job => {
          const res = await fetch(`${url}/job/${job.path}/api/json?tree=allBuilds[duration,timestamp,number,result]`, opts)
          const json = await res.json()
          let numberOfBuildsOfSuccessfullBuilds = nbrOfBuilds
          let successfullBuilds = json.allBuilds.filter(build => build.result === 'SUCCESS')
          if (successfullBuilds.length < numberOfBuildsOfSuccessfullBuilds) {
            numberOfBuildsOfSuccessfullBuilds = successfullBuilds.length
          }
          let builds = successfullBuilds.filter((value, index) => index < numberOfBuildsOfSuccessfullBuilds)
          let averagebuildTime = builds.map(el => el.duration).reduce((prevValue, value) => prevValue + value) / numberOfBuildsOfSuccessfullBuilds
          return averagebuildTime
        })
      )

      this.setState({ error: false, loading: false, averagebuildTime: averagebuildTime })
    } catch (error) {
      console.error(error)
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { loading, error, averagebuildTime } = this.state
    const { title } = this.props

    return (
      <Widget title={title} error={error} loading={loading}>
        <TimeItem>{((averagebuildTime/1000)/60).toFixed(1)} min</TimeItem>
      </Widget>
    )
  }
}
