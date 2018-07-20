import { Component } from 'react'
import styled from 'styled-components'
import Widget from '../../widget'
import { PieChart, Pie, Cell, LabelList } from 'recharts'
import yup from 'yup'
import { basicAuthHeader } from '../../../lib/auth'
import fetch from 'isomorphic-unfetch'

const COLORS = ['#a50000', '#E96600', '#EDEA7A', '#16e25e', '#86edf8']
const priority = ['Highest', 'High', 'Medium', 'Low', 'Lowest']

const LegendContainer = styled.div`
    margin-top: 5px;
    max-height: 20px;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`

const ColoredSquare = styled.div.attrs({
  color: props => props.color || 'black'
})`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => props.color};
`

const Label = styled.span`
    color: ${props => props.theme.palette.textColor};
    font-size: 16px;
    line-height: 20px;
    margin-right: 2px;
    margin-left: 15px;
`

const ChartWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
`

const PieTitle = styled.div`
  font-weight: bolder;
  width: 250px;
  font-size: 14px;
  text-align: center;
  color: ${props => props.theme.palette.textColor};
`

const EmptyChart = styled.div`
    width: 250px;
    height: 100px;
    padding-top: 50px;
    line-height: 100px;
    font-size: 40px;
    text-align: center;
`

const schema = yup.object().shape({
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string(),
  project: yup.string().required(),
  url: yup.string().required()
})

const toResultObject = (promise) => {
  return promise
    .then(result => ({success: true, result}))
    .catch(error => ({success: false, error}))
}

export default class BugsCount extends Component {
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
        console.error(`${err.name} @ ${this.constructor.name}`, err.message)
        this.setState({error: true, loading: false})
      })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  async fetchInformation () {
    // const {authKey, url, query} = this.props
    // const opts = authKey ? {headers: basicAuthHeader(authKey)} : {}

    let data
    let od = this.getOpenDefectData()
    let cd = this.getClosedDefectData()
    await Promise.all([od, cd]).then(([openDefects, closeDefect]) => {
      data = {
        openDefects: {
          title: 'Open Defects',
          data: openDefects
        },
        closedDefects: {
          title: 'Closed Defects',
          data: closeDefect
        }
      }
    })

    this.setState({error: false, loading: false, data: data})
    this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
  }

  async getOpenDefectData () {
    return this.getDefectData(false)
  }

  async getClosedDefectData () {
    return this.getDefectData(true)
  }

  async getDefectData (closed) {
    const {authKey, url, project} = this.props
    const opts = authKey ? {headers: basicAuthHeader(authKey)} : {}
    const operator = closed ? '=' : '!='
    let promises = priority.map(async prio => {
      const jql = `project = ${project} AND issuetype = Bug AND status ${operator} "Done" AND priority = ${prio}`
      const res = await fetch(`${url}/rest/api/2/search?maxResults=0&jql=${jql}`, opts)
      return res.json()
    })
    let p = []
    await Promise.all(promises.map(toResultObject))
      .then(resp => {
        resp.forEach(r => {
          if (!r.success) {
            console.log(r.error.toString())
          } else if (r.result.total !== undefined) {
            p.push(r.result)
          }
        })
      })

    return priority.map((prio, i) => {
      if (p[i].total !== 0) {
        return {
          name: prio,
          value: p[i].total
        }
      } else {
        return undefined
      }
    })
  }

  render () {
    const {loading, error, data} = this.state
    const {title} = this.props
    const content = this.getContent(data)

    return (
      <Widget title={title} error={error} loading={loading} size='medium'>
        {content}
      </Widget>
    )
  }

  getContent (data) {
    if (data !== undefined) {
      const openDefectData = data.openDefects
      const closedDefectData = data.closedDefects
      return [
        (<LegendContainer key='legend_container'>
          <Label>Highest</Label>
          <ColoredSquare color={COLORS[0]} />
          <Label>High</Label>
          <ColoredSquare color={COLORS[1]} />
          <Label>Medium</Label>
          <ColoredSquare color={COLORS[2]} />
          <Label>Low</Label>
          <ColoredSquare color={COLORS[3]} />
          <Label>Lowest</Label>
          <ColoredSquare color={COLORS[4]} />
        </LegendContainer>),
        (<ChartWrapper key='chart_wrapper'>
          {this.getChartForData(openDefectData)}
          {this.getChartForData(closedDefectData)}
        </ChartWrapper>)
      ]
    } else {
      return ``
    }
  }

  getChartForData (d) {
    const data = d.data
    const hasData = (data.find(v => v !== undefined) !== undefined)
    if (hasData) {
      return (
        <div>
          <PieChart width={250} height={150}>
            <Pie isAnimationActive={false} cy={'95%'} data={data} dataKey={'value'} startAngle={180}
              endAngle={0} outerRadius={70} fill='#8884d8'>
              {
                data.map((entry, index) => (
                  <Cell key={index} data={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))
              }
              <LabelList dataKey='value' position='outside' offset={7}
                style={{stroke: 'black', fontSize: '18', fontWeight: '500', strokeWidth: '0.6'}} />
            </Pie>
          </PieChart>
          <PieTitle>{d.title}</PieTitle>
        </div>
      )
    } else {
      return (<EmptyChart>0</EmptyChart>)
    }
  }
}

/*
Open Defects(Highest/High/Medium/Low/Lowest)
Closed Defects(Highest/High/Medium/Low/Lowest)
Defect aging(<7 days, 7-14 days, >14 days)

Test Cases Planned
Test Cases Created
Test Cases Executed

User Story Planned
User Story Executed
 */
