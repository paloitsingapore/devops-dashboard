import Dashboard from '../components/dashboard'
import config from '../config'
import { Component } from 'react'

// Widgets
import BugsCount from '../components/widgets/jira/bugs-count'

// Theme
import theme from '../styles/uob-theme'

export default class Test extends Component {
  render () {
    return (
      <Dashboard title='TEST' theme={theme} animation={this.props.animation ? this.props.animation : 'flipIn'}>
        <BugsCount
          authKey='jira'
          title='Bugs'
          url={config.proxy_url + config.jira_url}
          project='TES'
        />
      </Dashboard>
    )
  }
}
