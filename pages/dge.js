import Dashboard from '../components/dashboard'
import config from '../config'
import { Component } from 'react'

// Widgets
import SonarQube from '../components/widgets/sonarqube'
import Jenkins from '../components/widgets/jenkins'
import JenkinsBranches from '../components/widgets/jenkins-branches'
import JenkinsBuildTime from '../components/widgets/jenkins-build-time'
import SonarqubeHistory from '../components/widgets/sonarqube-history'
import BugsCount from '../components/widgets/jira/bugs-count'

// Theme
import theme from '../styles/uob-theme'

export default class Backend extends Component {
  render () {
    return (
      <Dashboard title='DGE' theme={theme} animation={this.props.animation ? this.props.animation : 'flipIn'}>
        <Jenkins
          title='Master'
          url={config.proxy_url + config.jenkins_url}
          jobs={[
            {label: 'Master', path: 'DGE/job/Branches/job/master'}
          ]}
        />

        <JenkinsBranches
          url={config.proxy_url + config.jenkins_url}
          title='Branches'
          job={
            {
              label: 'DGE Services', path: 'DGE'
            }
          }
        />

        <JenkinsBuildTime
          title='Build Time'
          url={config.proxy_url + config.jenkins_url}
          nbrOfBuilds='10'
          jobs={[
            {path: 'DGE/job/Branches/job/master'}
          ]}
        />

        <SonarQube
          title='SonarQube'
          url={config.proxy_url + config.sonarqube_url}
          componentKey='com.uob.dge:dge'
        />

        <SonarqubeHistory
          title='Vulnerabilities'
          url={config.proxy_url + config.sonarqube_url}
          componentKey='com.uob.dge:dge'
          metricKey='vulnerabilities' />

        <BugsCount
          authKey='jira'
          title='Bugs'
          url={config.proxy_url + config.jira_url}
          project='DIGTRX'
        />

      </Dashboard>
    )
  }
}
