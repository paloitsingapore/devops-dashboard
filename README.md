<h1 align="center">
  Dashboard
</h1>

<p align="center">
  Create your own team dashboard with custom widgets.
</p>

## Table of Contents

* [Installation](#installation)
* [Server](#server)
  * [Development](#development)
  * [Production](#production)
  * [Docker](#docker)
* [Create a Dashboard](#create-a-dashboard)
* [Available Widgets](#available-widgets)
  * [DateTime](#datetime)
  * [Jenkins](#jenkins)
  * [JIRA Issue Count](#jira-issue-count)
  * [JIRA Sprint Days Remaining](#jira-sprint-days-remaining)
  * [Bitbucket PullRequest Count](#bitbucket-pullrequest-count)
  * [PageSpeed Insights Score](#pagespeed-insights-score)
  * [PageSpeed Insights Stats](#pagespeed-insights-stats)
  * [SonarQube](#sonarqube)
  * [Elasticsearch Hit Count](#elasticsearch-hit-count)
  * [GitHub Issue Count](#github-issue-count)
* [Available Themes](#available-themes)
  * [light](#light)
  * [dark](#dark)
* [Authentication](#authentication)
* [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
  * [Proxy](#proxy)
  * [Resources](#resources)
* [License](#license)

## Installation

1. [Download](../../archive/master.zip) or clone the repository.
2. Install the dependencies with `npm install`.

## Server

### Development

Run `npm run dev` and go to http://localhost:3000.

### Production

Build your dashboard for production with `npm run build` and then start the
server with `npm start`.

### Docker

1. Build your dashboard for production with `npm run build`
2. Build the image with `docker build -t dashboard .`
3. Start the container with `docker run -d -p 8080:3000 dashboard`
4. Go to http://localhost:8080

## Create a Dashboard

You can create multiple dashboards.
For example populate `pages/team-unicorn.js` inside your project:

```javascript
import Dashboard from '../components/dashboard'
import DateTime from '../components/widgets/datetime'
import theme from '../styles/uob-theme'

export default () => (
  <Dashboard theme={theme} animation='flipIn'>
    <DateTime />
  </Dashboard>
)
```

This dashboard is available at http://localhost:3000/team-unicorn.

For an example, see [pages/index.js](./pages/index.js).

## Create a Rotating Dashboard

If you have multiple dashboard and you would like to rotate between them, you can use the RotatingDashboard component.

If the rotating dashboard only contains 1 dashboard, it will not rotate.

```javascript
import RotatingDashboard from '../components/rotating-dashboard'
import Frontend from './frontend'
import DGE from './dge'

export default () =>
  <RotatingDashboard interval='10'>
    <Frontend /> /*SPL Client dashboard*/
    <DGE />      /*DGE Backend dashboard*/
  </RotatingDashboard>
```

#### props

* `interval`: Rotating interval in seconds (Default: `5`)

## Available Widgets

### [DateTime](./components/widgets/datetime/index.js)

#### Example

```javascript
import DateTime from '../components/widgets/datetime'

<DateTime interval={10000} />
```

#### props

* `interval`: Refresh interval in milliseconds (Default: `10000`)

### [Jenkins](./components/widgets/jenkins/index.js)
*!! Work in progress !!*

Can display multiple master status but is optimized for one. 

#### Example

```javascript
import Jenkins from '../components/widgets/jenkins'

<Jenkins
  url='https://builds.apache.org'
  jobs={[
    { label: 'Hadoop', path: 'Hadoop-trunk-Commit' },
    { label: 'Jackrabbit', path: 'Jackrabbit-trunk' },
    { label: 'JMeter', path: 'JMeter-trunk' }
  ]}
/>
```

#### props

* `title`: Widget title (Default: `Jenkins`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Jenkins URL
* `jobs`: List of all jobs
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [Jenkins Branches](./components/widgets/jenkins-branches/index.js)

Display the failing branches for a project.

#### Example

```javascript
import JenkinsBranches from '../components/widgets/jenkins-branches'

<JenkinsBranches
	url={config.proxy_url + config.jenkins_url}
	title='Branches'
	job={
		{
			label: 'DGE Services', path: 'DGE'
       }
    }
/>
```

#### props

* `title`: Widget title (Default: `Jenkins Branches`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Jenkins URL
* `jobs`: List of all jobs
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [Jenkins Build Time](./components/widgets/jenkins-branches/index.js)

Display the average build of the last x succesful build.

#### Example

```javascript
import JenkinsBuildTime from '../components/widgets/jenkins-build-time'

<JenkinsBuildTime
	title='Build Time'
	url={config.proxy_url + config.jenkins_url}
	nbrOfBuilds='5'
   jobs={[
   			{path: 'DGE/job/Branches/job/master'}
        ]}
/>
```

#### props

* `title`: Widget title (Default: `Jenkins Branches`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `nbrOfBuilds`: Number of successful build to take into account for the average build time (Default: `10`)
* `url`: Jenkins URL
* `jobs`: List of all jobs
* `authKey`: Credential key, defined in [auth.js](./auth.js)


### [JIRA Issue Count](./components/widgets/jira/issue-count.js)

#### Example

```javascript
import JiraIssueCount from '../components/widgets/jira/issue-count'

<JiraIssueCount
  title='JIRA Open Bugs'
  url='https://jira.atlassian.com'
  query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
/>
```

#### props

* `title`: Widget title (Default: `JIRA Issue Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: JIRA Server URL
* `query`: JIRA search query (`jql`)
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [JIRA Bugs Count](./components/widgets/jira/bugs-count.js)

#### Example

```javascript
import BugsCount from '../components/widgets/jira/bugs-count'

 <BugsCount
 	authKey='jira'
 	title='Bugs'
 	url={config.proxy_url + config.jira_url}
 	project='DIGTRX'
 />
```

#### props

* `title`: Widget title
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: JIRA Server URL
* `authKey`: Credential key, defined in [auth.js](./auth.js)


### [JIRA Sprint Days Remaining](./components/widgets/jira/sprint-days-remaining.js)

#### Example

```javascript
import JiraSprintDaysRemaining from '../components/widgets/jira/sprint-days-remaining'

<JiraSprintDaysRemaining
  title='Sprint Days'
  url='https://jira.atlassian.com'
  boardId={42}
/>
```

#### props

* `title`: Widget title (Default: `JIRA Sprint Days Remaining`)
* `interval`: Refresh interval in milliseconds (Default: `3600000`)
* `url`: JIRA Server URL
* `boardId`: JIRA board id
* `authKey`: Credential key, defined in [auth.js](./auth.js)


### [Bitbucket PullRequest Count](./components/widgets/bitbucket/pull-request-count.js)

#### Example

```javascript
import BitbucketPullRequestCount from '../components/widgets/bitbucket/pull-request-count'

<BitbucketPullRequestCount
  title='Bitbucket Open PR'
  url='https://bitbucket.typo3.com'
  project='EXT'
  repository='blog'
  users={['stekal', 'marleg', 'denhub']}
/>
```

#### props

* `title`: Widget title (Default: `Bitbucket PR Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Bitbucket Server URL
* `project`: Bitbucket project key
* `repository`: Bitbucket repository slug
* `users`: Bitbucket user slugs as an array
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [PageSpeed Insights Score](./components/widgets/pagespeed-insights/score.js)

#### Example

```javascript
import PageSpeedInsightsScore from '../components/widgets/pagespeed-insights/score'

<PageSpeedInsightsScore url='https://github.com' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Score`)
* `interval`: Refresh interval in milliseconds (Default: `43200000`)
* `url`: URL to fetch and analyze
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `false`)

### [PageSpeed Insights Stats](./components/widgets/pagespeed-insights/stats.js)

#### Example

```javascript
import PageSpeedInsightsStats from '../components/widgets/pagespeed-insights/stats'

<PageSpeedInsightsStats url='https://github.com' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Stats`)
* `interval`: Refresh interval in milliseconds (Default: `43200000`)
* `url`: URL to fetch and analyze
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `false`)

### [SonarQube](./components/widgets/sonarqube/index.js)

#### Example

```javascript
import SonarQube from '../components/widgets/sonarqube'

<SonarQube
  url='https://sonarcloud.io'
  componentKey='com.icegreen:greenmail-parent'
/>
```

#### props

* `title`: Widget title (Default: `SonarQube`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: SonarQube URL
* `componentKey`: SonarQube project key
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [SonarQube History](./components/widgets/sonarqube-history/index.js)

#### Example

```javascript
import SonarqubeHistory from '../components/widgets/sonarqube-history'

 <SonarqubeHistory
        title='Vulnerabilities'
        url={config.proxy_url + config.sonarqube_url}
        componentKey='com.uob.dge:dge'
        metricKey='vulnerabilities' />
```

#### props

* `title`: Widget title
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: SonarQube URL
* `componentKey`: SonarQube project key
* `metricKey` : SonarQube metric key (eg: vulnerabilities / coverage / tests
* `authKey`: Credential key, defined in [auth.js](./auth.js)


### [Elasticsearch Hit Count](./components/widgets/elasticsearch/hit-count.js)

#### Example

```javascript
import ElasticsearchHitCount from '../components/widgets/elasticsearch/hit-count'

<ElasticsearchHitCount
  title='Log Hits'
  url='http://ec2-34-210-144-223.us-west-2.compute.amazonaws.com:9200'
  index='blog'
  query='user:dilbert'
/>
```

#### props

* `title`: Widget title (Default: `Elasticsearch Hit Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Elasticsearch URL
* `index`: Elasticsearch index to search in
* `query`: Elasticsearch query
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [GitHub Issue Count](./components/widgets/github/issue-count.js)

#### Example

```javascript
import GitHubIssueCount from '../components/github/issue-count'

<GitHubIssueCount
  owner='danielbayerlein'
  repository='dashboard'
/>
```

#### props

* `title`: Widget title (Default: `GitHub Issue Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `owner`: Owner of the repository
* `repository`: Name of the repository
* `authKey`: Credential key, defined in [auth.js](./auth.js)

## Available Themes

### [uob](./styles/uob-theme.js)

```javascript
import uobTheme from '../styles/uob-theme'

<Dashboard theme={uobTheme}>
  ...
</Dashboard>
```

### [light](./styles/light-theme.js)

#### Example

```javascript
import lightTheme from '../styles/light-theme'

<Dashboard theme={lightTheme}>
  ...
</Dashboard>
```

#### Preview

![dashboard-light](https://cloud.githubusercontent.com/assets/457834/26214930/8c065dce-3bfe-11e7-9da0-2d6ebba2dfb8.png)

### [dark](./styles/dark-theme.js)

#### Example

```javascript
import darkTheme from '../styles/dark-theme'

<Dashboard theme={darkTheme}>
  ...
</Dashboard>
```

#### Preview

![dashboard-dark](https://cloud.githubusercontent.com/assets/457834/26214954/a668dc50-3bfe-11e7-8c19-7a0c7dd260e7.png)

## Authentication

Any widget can authenticate itself, should your server expect this. We use
[basic authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).

1. Define your credential key in [auth.js](./auth.js). For example:
   ```javascript
   jira: {
     username: process.env.JIRA_USER,
     password: process.env.JIRA_PASS
   }
   ```
2. Give the defined credential key `jira` via prop `authKey` to the widget.
   For example:
   ```javascript
   <JiraIssueCount
     authKey='jira'
     url='https://jira.atlassian.com'
     query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
   />
   ```
3. Create a `.env` file in the root directory of your project. Add
   environment-specific variables on new lines in the form of `NAME=VALUE`.
   For example:
   ```dosini
   JIRA_USER=root
   JIRA_PASS=s1mpl3
   ```

## Cross-Origin Resource Sharing (CORS)

[Cross-Origin Resource Sharing](https://www.w3.org/TR/cors/) (CORS) is a W3C
spec that allows cross-domain communication from the browser. By building on
top of the XMLHttpRequest object, CORS allows developers to work with the same
idioms as same-domain requests.

### Proxy

You can use a proxy (e.g. [hapi-rest-proxy](https://github.com/chrishelgert/hapi-rest-proxy))
to enable CORS request for any website.

#### Server

```bash
docker pull chrishelgert/hapi-rest-proxy
docker run -d -p 3001:8080 chrishelgert/hapi-rest-proxy
```

#### Dashboard

```javascript
<SonarQube
  url='http://127.0.0.1:3001/?url=https://sonarcloud.io'
  componentKey='com.icegreen:greenmail-parent'
/>
```

### Resources

* https://www.w3.org/TR/cors/
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
* https://enable-cors.org
* https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

## License

Copyright (c) 2017-present Daniel Bayerlein. See [LICENSE](./LICENSE.md) for details.
