import { Component } from 'react'
import { withTheme } from 'styled-components'
import {AreaChart, Area, XAxis, YAxis} from 'recharts'
import Widget from '../../widget'
import { basicAuthHeader } from '../../../lib/auth'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import moment from 'moment'

const schema = yup.object().shape({
  // url: yup.string().url().required(),
  componentKey: yup.string().required(),
  metricKey: yup.string().required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string()
})

class SonarqubeHistory extends Component {
  static defaultProps = {
    interval: 1000 * 10
  }

  state = {
    measures: [],
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
    const { authKey, url, componentKey, metricKey } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    // https://docs.sonarqube.org/display/SONAR/Metric+Definitions
    // const metricKeys = [
    //   'alert_status', 'reliability_rating', 'bugs', 'security_rating',
    //   'vulnerabilities', 'sqale_rating', 'code_smells', 'coverage',
    //   'duplicated_lines_density'
    // ].join(',')

    try {
      const res = await fetch(`${url}/api/measures/search_history?component=${componentKey}&metrics=${metricKey}`, opts)
      const json = await res.json()

      this.setState({ error: false, loading: false, measures: json.measures })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { loading, error, measures } = this.state
    const { title } = this.props

    let content = (measures && measures.length > 0) ? this.getChart() : ''
    return (
      <Widget title={title} loading={loading} error={error} size='big'>
        {content}
      </Widget>
    )
  }

  getChart () {
    const { measures } = this.state
    let data = measures[0].history
    data = data.map(entry => {
      return {
        date: Date.parse(entry.date),
        value: Number(entry.value)
      }
    })
    return (
      <AreaChart width={650} height={250} data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          stroke={this.props.theme.palette.chartAxisColor}
          dataKey='date'
          type='number'
          scale='time'
          domain={['auto', 'auto']}
          tickFormatter={(unixTime) => moment(unixTime).format('MMM DD')}
          name='Time'
        />
        <YAxis stroke={this.props.theme.palette.chartAxisColor} />
        <Area type='monotone' dataKey='value' stroke='#82ca9d' fillOpacity={1} fill='url(#colorPv)' />
      </AreaChart>
    )
  }
}

export default withTheme(SonarqubeHistory)
