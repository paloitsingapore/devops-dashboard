import Dashboard from '../components/dashboard'
import { Component } from 'react'

// Widgets
import SonarQube from '../components/widgets/sonarqube'
import Jenkins from '../components/widgets/jenkins'
import JenkinsBranches from '../components/widgets/jenkins-branches'

// Theme
import theme from '../styles/uob-theme'
import config from '../config'

export default class Backend extends Component {
  render () {
    return (<Dashboard theme={theme} animation={this.props ? this.props.animation : ''}>
      <Jenkins
        title='BKS Master'
        url={config.proxy_url + config.jenkins_url}
        jobs={[
          {label: 'Master', path: 'BKS/job/Branches/job/master'}
        ]}
      />

      <JenkinsBranches
        url={config.proxy_url + config.jenkins_url}
        title='BKS Branches'
        job={
          {
            label: 'BKS Services', path: 'BKS'
          }
        }
      />

      <SonarQube
        title='BKS SonarQube'
        url={config.proxy_url + config.sonarqube_url}
        componentKey='com.uob.dge:dge'
      />

      <Jenkins
        title='Simple Master'
        url={config.proxy_url + config.jenkins_url}
        jobs={[
          {label: 'Master', path: 'SPL-Services/job/Branches/job/master'}
        ]}
      />

      <JenkinsBranches
        url={config.proxy_url + config.jenkins_url}
        title='Simple Branches'
        job={{
          label: 'Simple Services', path: 'SPL-Services'
        }
        }
      />

      <SonarQube
        title='Simple SonarQube'
        url={config.proxy_url + config.sonarqube_url}
        componentKey='com.uob.spl:uob-simple'
      />

    </Dashboard>
    )
  }
}
