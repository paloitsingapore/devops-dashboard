import Dashboard from '../components/dashboard'
import { Component } from 'react'

import Jenkins from '../components/widgets/jenkins'
import JenkinsBranches from '../components/widgets/jenkins-branches'
import theme from '../styles/uob-theme'
import config from '../config'

export default class Frontend extends Component {
  render () {
    return (
      <Dashboard theme={theme} title='SPL Client' animation={this.props.animation ? this.props.animation : 'flipIn'}>
        <Jenkins
          title='Master'
          url={config.proxy_url + config.jenkins_url}
          jobs={[
            {label: 'Master', path: 'SPL-Client/job/Branches/job/master'}
          ]}
        />
        <JenkinsBranches
          url={config.proxy_url + config.jenkins_url}
          title='Branches'
          job={
            {
              label: 'SPL Client', path: 'SPL-Client'
            }
          }
        />
      </Dashboard>
    )
  }
}
